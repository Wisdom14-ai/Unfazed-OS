"use client";

import { useEffect, useState } from "react";
import {
    Flame,
    Clock,
    Smartphone,
    Dumbbell,
    Beef,
    Trophy,
    Check,
    X,
    Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import type { Tables } from "@/lib/database.types";
import {
    averageTimeMinutes,
    clampPercent,
    formatMinutes12Hour,
    formatMinutesForInput,
    formatNumberValue,
    getHabitInputType,
    getHabitTimeMode,
    getInclusiveDayCount,
    getMalaysiaDateParts,
    getWeekStartMonday,
    parseTimeInputToMinutes,
} from "@/lib/habitTracking";

type Habit = Tables<"habits">;
type HabitLog = Tables<"habit_logs">;
type DeepWorkSession = Tables<"deep_work_sessions">;
type Workout = Tables<"workouts">;
type DailyMeta = Tables<"daily_metadata">;

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getDayLabel(year: number, month: number, day: number) {
    const d = new Date(Date.UTC(year, month, day));
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
}

function dateStr(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const workoutTypeColors: Record<string, string> = {
    "Marathon Prep": "text-blue-400 bg-blue-400/10",
    "Heavy Lifting": "text-orange-400 bg-orange-400/10",
    "Muay Thai": "text-red-400 bg-red-400/10",
    Light: "text-emerald-400 bg-emerald-400/10",
    Hard: "text-red-400 bg-red-400/10",
};

export default function ForgePage() {
    const { showToast } = useToast();
    const malaysiaToday = getMalaysiaDateParts();
    const [year] = useState(malaysiaToday.year);
    const [month] = useState(malaysiaToday.month - 1);
    const todayDay = malaysiaToday.day;

    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [deepWorkSessions, setDeepWorkSessions] = useState<DeepWorkSession[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [dailyMeta, setDailyMeta] = useState<DailyMeta | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showDWModal, setShowDWModal] = useState(false);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [dwForm, setDwForm] = useState({ date: dateStr(year, month, todayDay), hours: "4.5", focus: "", completed: true });
    const [woForm, setWoForm] = useState({ date: dateStr(year, month, todayDay), type: "Heavy Lifting", duration: "60", notes: "" });
    // Cell input modal
    const [editingCell, setEditingCell] = useState<{ habit: Habit; day: number } | null>(null);
    const [cellValue, setCellValue] = useState("");

    const daysInMonth = getDaysInMonth(year, month);
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

    const todayStr = dateStr(year, month, todayDay);
    const monthStartStr = dateStr(year, month, 1);
    const weekStartStr = getWeekStartMonday(todayStr);
    const logQueryStartStr = weekStartStr < monthStartStr ? weekStartStr : monthStartStr;
    const weekElapsedDays = getInclusiveDayCount(weekStartStr, todayStr);
    const monthElapsedDays = getInclusiveDayCount(monthStartStr, todayStr);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const startDate = monthStartStr;
            const endDate = dateStr(year, month, daysInMonth);

            const [habitsRes, logsRes, dwRes, woRes, metaRes] = await Promise.all([
                supabase.from("habits").select("*").eq("is_active", true).order("sort_order"),
                supabase.from("habit_logs").select("*").gte("date", logQueryStartStr).lte("date", endDate),
                supabase.from("deep_work_sessions").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: false }),
                supabase.from("workouts").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: false }),
                supabase.from("daily_metadata").select("*").eq("date", todayStr).single(),
            ]);

            setHabits(habitsRes.data || []);
            setLogs(logsRes.data || []);
            setDeepWorkSessions(dwRes.data || []);
            setWorkouts(woRes.data || []);
            setDailyMeta(metaRes.data);
            setLoading(false);
        };

        void loadData();
    }, [year, month, daysInMonth, todayStr, logQueryStartStr, monthStartStr]);

    // Toggle boolean habit or open input modal
    const handleCellClick = async (habit: Habit, day: number) => {
        if (day > todayDay) return; // Can't log future
        const inputType = getHabitInputType(habit.input_type);
        const ds = dateStr(year, month, day);
        const existing = logs.find((l) => l.habit_id === habit.id && l.date === ds);

        if (inputType === "number") {
            setCellValue(existing ? String(existing.value) : "");
            setEditingCell({ habit, day });
            return;
        }

        if (inputType === "time") {
            const existingTimeValue =
                existing?.entry_type === "time" && typeof existing.time_minutes === "number"
                    ? formatMinutesForInput(existing.time_minutes)
                    : "";
            setCellValue(existingTimeValue);
            setEditingCell({ habit, day });
            return;
        }

        // Boolean toggle
        if (existing && existing.value > 0) {
            await supabase.from("habit_logs").delete().eq("id", existing.id);
            setLogs((prev) => prev.filter((l) => l.id !== existing.id));
        } else {
            const { data } = await supabase
                .from("habit_logs")
                .upsert({ habit_id: habit.id, date: ds, value: 1, entry_type: "boolean", time_minutes: null }, { onConflict: "habit_id,date" })
                .select()
                .single();
            if (data) setLogs((prev) => [...prev.filter((l) => !(l.habit_id === habit.id && l.date === ds)), data]);
        }
    };

    const saveCellValue = async () => {
        if (!editingCell) return;
        const ds = dateStr(year, month, editingCell.day);
        const inputType = getHabitInputType(editingCell.habit.input_type);
        const existing = logs.find((l) => l.habit_id === editingCell.habit.id && l.date === ds);

        if (inputType === "number") {
            const value = parseFloat(cellValue);
            if (!Number.isFinite(value) || value <= 0) {
                if (existing) {
                    await supabase.from("habit_logs").delete().eq("id", existing.id);
                    setLogs((prev) => prev.filter((l) => l.id !== existing.id));
                }
            } else {
                const { data } = await supabase
                    .from("habit_logs")
                    .upsert(
                        { habit_id: editingCell.habit.id, date: ds, value, entry_type: "number", time_minutes: null },
                        { onConflict: "habit_id,date" }
                    )
                    .select()
                    .single();
                if (data) setLogs((prev) => [...prev.filter((l) => !(l.habit_id === editingCell.habit.id && l.date === ds)), data]);
            }
        } else if (inputType === "time") {
            const timeMinutes = parseTimeInputToMinutes(cellValue);
            if (timeMinutes === null) {
                if (existing) {
                    await supabase.from("habit_logs").delete().eq("id", existing.id);
                    setLogs((prev) => prev.filter((l) => l.id !== existing.id));
                }
            } else {
                const hourValue = Math.round((timeMinutes / 60) * 100) / 100;
                const { data } = await supabase
                    .from("habit_logs")
                    .upsert(
                        { habit_id: editingCell.habit.id, date: ds, value: hourValue, entry_type: "time", time_minutes: timeMinutes },
                        { onConflict: "habit_id,date" }
                    )
                    .select()
                    .single();
                if (data) setLogs((prev) => [...prev.filter((l) => !(l.habit_id === editingCell.habit.id && l.date === ds)), data]);
            }
        }
        setEditingCell(null);
        showToast("Entry saved", "success");
    };

    // Cell color
    const getCellColor = (habit: Habit, day: number) => {
        if (day > todayDay) return "bg-[var(--color-surface)]";
        const inputType = getHabitInputType(habit.input_type);
        const log = logs.find((l) => l.habit_id === habit.id && l.date === dateStr(year, month, day));

        if (inputType === "time") {
            const hasTimeLog = log?.entry_type === "time" && typeof log.time_minutes === "number";
            if (!hasTimeLog) return "bg-red-500/20 border-red-500/30";
            return "bg-emerald-500/20 border-emerald-500/30";
        }

        if (!log || log.value === 0) return "bg-red-500/20 border-red-500/30";
        if (inputType === "number" && habit.target_value) {
            return log.value >= habit.target_value
                ? "bg-emerald-500/20 border-emerald-500/30"
                : "bg-yellow-500/20 border-yellow-500/30";
        }
        return "bg-emerald-500/20 border-emerald-500/30";
    };

    const getCellText = (habit: Habit, day: number) => {
        if (day > todayDay) return "";
        const log = logs.find((l) => l.habit_id === habit.id && l.date === dateStr(year, month, day));
        const inputType = getHabitInputType(habit.input_type);

        if (inputType === "time") {
            return log?.entry_type === "time" && typeof log.time_minutes === "number" ? "*" : "";
        }

        if (!log || log.value === 0) return "";
        if (inputType === "number") return formatNumberValue(log.value);
        return "Y";
    };

    // Weekly + monthly summaries
    const getRangeLogs = (habit: Habit, startDate: string, endDate: string) => {
        return logs.filter((l) => l.habit_id === habit.id && l.date >= startDate && l.date <= endDate);
    };

    const formatPercent = (value: number) => `${Math.round(clampPercent(value))}%`;

    const getRangeSummary = (habit: Habit, startDate: string, endDate: string, elapsedDays: number) => {
        const inputType = getHabitInputType(habit.input_type);
        const rangeLogs = getRangeLogs(habit, startDate, endDate);

        if (inputType === "time") {
            const minutes = rangeLogs
                .filter((log) => log.entry_type === "time" && typeof log.time_minutes === "number")
                .map((log) => log.time_minutes as number);
            const avgMinutes = averageTimeMinutes(minutes, getHabitTimeMode(habit.time_mode) === "sleep");
            return avgMinutes === null ? "-" : formatMinutes12Hour(avgMinutes);
        }

        if (inputType === "boolean") {
            const completedDays = new Set(rangeLogs.filter((log) => log.value > 0).map((log) => log.date)).size;
            return formatPercent((completedDays / elapsedDays) * 100);
        }

        const total = rangeLogs.filter((log) => log.value > 0).reduce((sum, log) => sum + log.value, 0);
        const target = habit.target_value || 0;
        if (target <= 0) return "0%";

        return formatPercent((total / (target * elapsedDays)) * 100);
    };

    const getWeekSummary = (habit: Habit) => getRangeSummary(habit, weekStartStr, todayStr, weekElapsedDays);
    const getMonthSummary = (habit: Habit) => getRangeSummary(habit, monthStartStr, todayStr, monthElapsedDays);
    const editingInputType = editingCell ? getHabitInputType(editingCell.habit.input_type) : "number";

    // Screen time & OMAD
    const [screenTime, setScreenTime] = useState("0");
    const [omadDone, setOmadDone] = useState(false);
    const [wholeFoodsFirst, setWholeFoodsFirst] = useState(false);
    const [proteinHit, setProteinHit] = useState(false);
    const [water3l, setWater3l] = useState(false);

    useEffect(() => {
        if (dailyMeta) {
            setScreenTime(String(dailyMeta.screen_time_hours || 0));
            setOmadDone(dailyMeta.omad_done || false);
            setWholeFoodsFirst(dailyMeta.whole_foods_first || false);
            setProteinHit(dailyMeta.protein_hit || false);
            setWater3l(dailyMeta.water_3l || false);
        }
    }, [dailyMeta]);

    const saveDailyMeta = async (updates: Partial<DailyMeta>) => {
        const payload = { date: todayStr, ...updates };
        const { data } = await supabase
            .from("daily_metadata")
            .upsert(payload, { onConflict: "date" })
            .select()
            .single();
        if (data) setDailyMeta(data);
    };

    // Add deep work session
    const addDeepWork = async () => {
        const { data, error } = await supabase
            .from("deep_work_sessions")
            .insert({
                date: dwForm.date,
                hours: parseFloat(dwForm.hours),
                focus: dwForm.focus,
                completed: dwForm.completed,
            })
            .select()
            .single();
        if (!error && data) {
            setDeepWorkSessions((prev) => [data, ...prev]);
            setShowDWModal(false);
            setDwForm({ date: todayStr, hours: "4.5", focus: "", completed: true });
            showToast("Deep work session logged!", "success");
        }
    };

    // Add workout
    const addWorkout = async () => {
        const { data, error } = await supabase
            .from("workouts")
            .insert({
                date: woForm.date,
                type: woForm.type,
                duration_minutes: parseInt(woForm.duration),
                notes: woForm.notes,
            })
            .select()
            .single();
        if (!error && data) {
            setWorkouts((prev) => [data, ...prev]);
            setShowWorkoutModal(false);
            setWoForm({ date: todayStr, type: "Heavy Lifting", duration: "60", notes: "" });
            showToast("Workout logged!", "success");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-[var(--color-text-muted)]">Loading The Forge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Flame className="w-6 h-6 text-[var(--color-gold)]" />
                    The Forge
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    10% Routine That Leads to 90% Results - {monthName} {year}
                </p>
            </div>

            {/* FULL MONTH HABIT MATRIX */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Habit Matrix - {monthName} {year}
                    </h2>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold-glow)] text-[var(--color-gold)]">
                        Day {todayDay} of {daysInMonth}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-[var(--color-border)]">
                                <th className="text-left px-4 py-2 text-[var(--color-text-muted)] uppercase tracking-wider font-medium sticky left-0 bg-[var(--color-card)] z-10 min-w-[140px]">
                                    Habit
                                </th>
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                    <th key={day} className="px-0 py-2 text-center min-w-[32px]">
                                        <div className={`text-[10px] font-medium ${day === todayDay ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"}`}>
                                            {getDayLabel(year, month, day).charAt(0)}
                                        </div>
                                        <div className={`text-[10px] ${day === todayDay ? "text-[var(--color-gold)] font-bold" : "text-[var(--color-text-muted)]"}`}>
                                            {day}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-3 py-2 text-[var(--color-text-muted)] uppercase tracking-wider font-medium text-center">
                                    Week
                                </th>
                                <th className="px-3 py-2 text-[var(--color-text-muted)] uppercase tracking-wider font-medium text-center">
                                    Month
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                                    <td className="px-4 py-2 sticky left-0 bg-[var(--color-card)] z-10">
                                        <p className="text-xs font-medium text-white whitespace-nowrap">{habit.name}</p>
                                        <p className="text-[10px] text-[var(--color-text-muted)]">{habit.category}</p>
                                    </td>
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                                        <td key={day} className="px-0 py-1 text-center">
                                            <button
                                                onClick={() => handleCellClick(habit, day)}
                                                disabled={day > todayDay}
                                                className={`w-7 h-7 rounded border text-[10px] font-bold transition-all duration-150 ${getCellColor(habit, day)} ${day <= todayDay ? "cursor-pointer hover:scale-110" : "cursor-default opacity-40"
                                                    } ${day === todayDay ? "ring-1 ring-[var(--color-gold)]/50" : ""}`}
                                            >
                                                {getCellText(habit, day)}
                                            </button>
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-center">
                                        <span className="text-xs font-medium text-white">{getWeekSummary(habit)}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{getMonthSummary(habit)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Habit Input Modal */}
            <Modal
                isOpen={!!editingCell}
                onClose={() => setEditingCell(null)}
                title={`Log ${editingCell?.habit.name || ""}`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        {editingInputType === "time"
                            ? `Enter time for Day ${editingCell?.day}`
                            : `Enter value for Day ${editingCell?.day} (${editingCell?.habit.unit || "units"})`}
                    </p>
                    {editingInputType === "time" ? (
                        <input
                            type="time"
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") saveCellValue(); }}
                        />
                    ) : (
                        <input
                            type="number"
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            placeholder={`Target: ${editingCell?.habit.target_value || 0}`}
                            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            autoFocus
                            step="0.5"
                            onKeyDown={(e) => { if (e.key === "Enter") saveCellValue(); }}
                        />
                    )}
                    <button
                        onClick={saveCellValue}
                        className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors"
                    >
                        Save
                    </button>
                </div>
            </Modal>

            {/* DEEP WORK ENGINE + SCREEN TIME */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                            <h2 className="text-lg font-semibold text-white">Deep Work Engine</h2>
                        </div>
                        <button
                            onClick={() => setShowDWModal(true)}
                            className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors"
                        >
                            + Log Session
                        </button>
                    </div>
                    <div className="space-y-3">
                        {deepWorkSessions.length === 0 ? (
                            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No sessions logged this month. Start logging!</p>
                        ) : (
                            deepWorkSessions.map((s) => (
                                <div key={s.id} className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.completed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                        {s.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{s.focus || "No focus specified"}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{s.date}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold text-white">{s.hours}h</p>
                                        <p className={`text-xs ${s.hours >= 4.5 ? "text-emerald-400" : "text-[var(--color-warning)]"}`}>
                                            {s.hours >= 4.5 ? "Target hit" : "Below target"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Screen Time */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Smartphone className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Screen Time</h2>
                    </div>
                    <div className="text-center py-8">
                        <div className="inline-flex items-baseline gap-1">
                            <input
                                type="number"
                                value={screenTime}
                                onChange={(e) => {
                                    setScreenTime(e.target.value);
                                    saveDailyMeta({ screen_time_hours: parseFloat(e.target.value) || 0 });
                                }}
                                className="w-20 text-4xl font-bold text-white bg-transparent border-b-2 border-[var(--color-border)] focus:border-[var(--color-gold)] text-center outline-none transition-colors"
                                step="0.5"
                                min="0"
                                max="24"
                            />
                            <span className="text-lg text-[var(--color-text-muted)]">hrs</span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] mt-3">Today&apos;s phone usage</p>
                        <div className="mt-4">
                            {parseFloat(screenTime) <= 2 ? (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400">Under control</span>
                            ) : parseFloat(screenTime) <= 4 ? (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400">Watch it</span>
                            ) : (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 text-red-400">Too high</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PHYSICAL & DIET */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workout Logger */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-[var(--color-gold)]" />
                            <h2 className="text-lg font-semibold text-white">Workout Log</h2>
                        </div>
                        <button
                            onClick={() => setShowWorkoutModal(true)}
                            className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors"
                        >
                            + Log Workout
                        </button>
                    </div>
                    <div className="space-y-3">
                        {workouts.length === 0 ? (
                            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No workouts logged. Get moving!</p>
                        ) : (
                            workouts.map((w) => (
                                <div key={w.id} className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${workoutTypeColors[w.type] || "text-gray-400 bg-gray-400/10"}`}>
                                        {w.type}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{w.notes || "No notes"}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{w.date} - {w.duration_minutes} min</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* OMAD Compliance */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Beef className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">OMAD Compliance</h2>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] mb-4">
                        <div>
                            <p className="text-sm font-medium text-white">One Meal A Day</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Did you eat only one main meal today?</p>
                        </div>
                        <button
                            onClick={() => {
                                const newVal = !omadDone;
                                setOmadDone(newVal);
                                saveDailyMeta({ omad_done: newVal });
                            }}
                            className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${omadDone ? "bg-[var(--color-gold)]" : "bg-[var(--color-border)]"}`}
                        >
                            <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${omadDone ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Nutrition Checklist</p>
                        {[
                            { label: "Whole foods eaten before junk food", checked: wholeFoodsFirst, key: "whole_foods_first" as const, set: setWholeFoodsFirst },
                            { label: "Protein target hit (min 120g)", checked: proteinHit, key: "protein_hit" as const, set: setProteinHit },
                            { label: "Water intake 3L+", checked: water3l, key: "water_3l" as const, set: setWater3l },
                        ].map((item) => (
                            <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border)] transition-colors">
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => {
                                        const newVal = !item.checked;
                                        item.set(newVal);
                                        saveDailyMeta({ [item.key]: newVal });
                                    }}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${item.checked ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "border-[var(--color-border)]"}`}>
                                    {item.checked && <Check className="w-3 h-3 text-black" />}
                                </div>
                                <span className="text-sm text-white">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {/* Deep Work Modal */}
            <Modal isOpen={showDWModal} onClose={() => setShowDWModal(false)} title="Log Deep Work Session">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Date</label>
                        <input type="date" value={dwForm.date} onChange={(e) => setDwForm({ ...dwForm, date: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Hours</label>
                        <input type="number" step="0.5" value={dwForm.hours} onChange={(e) => setDwForm({ ...dwForm, hours: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Focus</label>
                        <input type="text" value={dwForm.focus} onChange={(e) => setDwForm({ ...dwForm, focus: e.target.value })} placeholder="e.g. Client Proposal - Attic KL" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={dwForm.completed} onChange={(e) => setDwForm({ ...dwForm, completed: e.target.checked })} className="sr-only" />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${dwForm.completed ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "border-[var(--color-border)]"}`}>
                            {dwForm.completed && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <span className="text-sm text-white">Completed full session</span>
                    </label>
                    <button onClick={addDeepWork} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Log Session
                    </button>
                </div>
            </Modal>

            {/* Workout Modal */}
            <Modal isOpen={showWorkoutModal} onClose={() => setShowWorkoutModal(false)} title="Log Workout">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Date</label>
                        <input type="date" value={woForm.date} onChange={(e) => setWoForm({ ...woForm, date: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Type</label>
                        <select value={woForm.type} onChange={(e) => setWoForm({ ...woForm, type: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                            <option>Heavy Lifting</option>
                            <option>Muay Thai</option>
                            <option>Marathon Prep</option>
                            <option>Light</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Duration (minutes)</label>
                        <input type="number" value={woForm.duration} onChange={(e) => setWoForm({ ...woForm, duration: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Notes</label>
                        <input type="text" value={woForm.notes} onChange={(e) => setWoForm({ ...woForm, notes: e.target.value })} placeholder="e.g. Pad work + sparring" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <button onClick={addWorkout} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" /> Log Workout
                    </button>
                </div>
            </Modal>
        </div>
    );
}
