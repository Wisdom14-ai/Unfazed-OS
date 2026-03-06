"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Flame,
  Clock,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Target,
  Brain,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import type { Tables } from "@/lib/database.types";
import {
  formatMinutes12Hour,
  formatMinutesForInput,
  formatNumberValue,
  getHabitInputType,
  getMalaysiaDateParts,
  getMalaysiaTodayStr,
  parseTimeInputToMinutes,
} from "@/lib/habitTracking";

type Habit = Tables<"habits">;
type HabitLog = Tables<"habit_logs">;

function dateStrFromUTC(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [deepWorkToday, setDeepWorkToday] = useState(0);
  const [revenueMTD, setRevenueMTD] = useState(0);
  const [revenueTarget] = useState(60000);
  const [streak, setStreak] = useState(0);
  const [recentActivity, setRecentActivity] = useState<{ time: string; text: string; icon: string }[]>([]);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);

  const today = getMalaysiaTodayStr();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load habits
      const { data: habitsData } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      // Load today's logs
      const { data: logsData } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("date", today);

      // Deep work today
      const { data: dwData } = await supabase
        .from("deep_work_sessions")
        .select("hours")
        .eq("date", today);

      // Revenue MTD
      const startOfMonth = today.substring(0, 7) + "-01";
      const { data: txData } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "income")
        .gte("date", startOfMonth)
        .lte("date", today);

      // Calculate streak - consecutive days with at least 1 habit logged
      let streakCount = 0;
      const malaysiaNow = getMalaysiaDateParts();
      const checkDate = new Date(Date.UTC(malaysiaNow.year, malaysiaNow.month - 1, malaysiaNow.day));
      for (let i = 0; i < 365; i++) {
        const dateStr = dateStrFromUTC(checkDate);
        const { data: dayLogs } = await supabase
          .from("habit_logs")
          .select("id")
          .eq("date", dateStr)
          .limit(1);
        if (dayLogs && dayLogs.length > 0) {
          streakCount++;
          checkDate.setUTCDate(checkDate.getUTCDate() - 1);
        } else {
          if (i === 0) {
            // Today not started yet, check from yesterday
            checkDate.setUTCDate(checkDate.getUTCDate() - 1);
            continue;
          }
          break;
        }
      }

      // Recent activity - last 5 habit logs, workouts, sessions
      const { data: recentLogs } = await supabase
        .from("habit_logs")
        .select("*, habits(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      const activity = (recentLogs || []).map((log) => {
        let suffix = "done";
        if (log.entry_type === "time" && typeof log.time_minutes === "number") {
          suffix = formatMinutes12Hour(log.time_minutes);
        } else if (log.value > 0 && (log.entry_type === "number" || log.value !== 1)) {
          suffix = `${formatNumberValue(log.value)} logged`;
        }
        return {
          time: new Date(log.created_at || "").toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          text: `Completed ${(log as { habits: { name: string } | null }).habits?.name || "habit"} — ${suffix}`,
          icon: "✅",
        };
      });

      setHabits(habitsData || []);
      setLogs(logsData || []);
      setDeepWorkToday(
        (dwData || []).reduce((sum, s) => sum + s.hours, 0)
      );
      setRevenueMTD(
        (txData || []).reduce((sum, t) => sum + t.amount, 0)
      );
      setStreak(streakCount);
      setRecentActivity(activity.length > 0 ? activity : [
        { time: "—", text: "No activity yet today. Start logging!", icon: "💡" },
      ]);
    } catch {
      showToast("Failed to load dashboard data", "error");
    }
    setLoading(false);
  }, [today, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isHabitDone = (habit: Habit) => {
    const inputType = getHabitInputType(habit.input_type);
    if (inputType === "boolean") {
      return logs.some((log) => log.habit_id === habit.id && log.value > 0);
    }
    return logs.some((log) => log.habit_id === habit.id);
  };

  const getHabitCurrentValue = (habit: Habit) => {
    const inputType = getHabitInputType(habit.input_type);
    const existing = logs.find((log) => log.habit_id === habit.id);
    if (!existing) return "";

    if (inputType === "number") {
      const left = formatNumberValue(existing.value);
      const right = habit.target_value ? formatNumberValue(habit.target_value) : "1";
      return `${left}/${right}`;
    }

    if (inputType === "time" && existing.entry_type === "time" && typeof existing.time_minutes === "number") {
      return formatMinutes12Hour(existing.time_minutes);
    }

    return "";
  };

  const completedCount = habits.filter((habit) => isHabitDone(habit)).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const toggleBooleanHabit = async (habit: Habit) => {
    const existingLog = logs.find((l) => l.habit_id === habit.id);

    if (existingLog && existingLog.value > 0) {
      // Remove log
      await supabase.from("habit_logs").delete().eq("id", existingLog.id);
      setLogs((prev) => prev.filter((l) => l.id !== existingLog.id));
      showToast(`Unchecked "${habit.name}"`, "info");
    } else {
      // Upsert log
      const { data, error } = await supabase
        .from("habit_logs")
        .upsert(
          { habit_id: habit.id, date: today, value: 1, entry_type: "boolean", time_minutes: null },
          { onConflict: "habit_id,date" }
        )
        .select()
        .single();

      if (!error && data) {
        setLogs((prev) => [...prev.filter((l) => l.habit_id !== habit.id), data]);
        showToast(`Checked "${habit.name}" ✓`, "success");
      }
    }
  };

  const openInputForHabit = (habit: Habit) => {
    const inputType = getHabitInputType(habit.input_type);
    if (inputType === "boolean") {
      void toggleBooleanHabit(habit);
      return;
    }

    const existing = logs.find((log) => log.habit_id === habit.id);
    if (inputType === "number") {
      setInputValue(existing ? String(existing.value) : "");
    } else {
      const initial =
        existing?.entry_type === "time" && typeof existing.time_minutes === "number"
          ? formatMinutesForInput(existing.time_minutes)
          : "";
      setInputValue(initial);
    }
    setEditingHabit(habit);
  };

  const saveHabitInput = async () => {
    if (!editingHabit) return;

    const inputType = getHabitInputType(editingHabit.input_type);
    const existing = logs.find((log) => log.habit_id === editingHabit.id);

    if (inputType === "number") {
      const value = parseFloat(inputValue);
      if (!Number.isFinite(value) || value <= 0) {
        if (existing) {
          await supabase.from("habit_logs").delete().eq("id", existing.id);
          setLogs((prev) => prev.filter((log) => log.id !== existing.id));
        }
      } else {
        const { data } = await supabase
          .from("habit_logs")
          .upsert(
            { habit_id: editingHabit.id, date: today, value, entry_type: "number", time_minutes: null },
            { onConflict: "habit_id,date" }
          )
          .select()
          .single();
        if (data) {
          setLogs((prev) => [...prev.filter((log) => log.habit_id !== editingHabit.id), data]);
        }
      }
    }

    if (inputType === "time") {
      const timeMinutes = parseTimeInputToMinutes(inputValue);
      if (timeMinutes === null) {
        if (existing) {
          await supabase.from("habit_logs").delete().eq("id", existing.id);
          setLogs((prev) => prev.filter((log) => log.id !== existing.id));
        }
      } else {
        const hourValue = Math.round((timeMinutes / 60) * 100) / 100;
        const { data } = await supabase
          .from("habit_logs")
          .upsert(
            { habit_id: editingHabit.id, date: today, value: hourValue, entry_type: "time", time_minutes: timeMinutes },
            { onConflict: "habit_id,date" }
          )
          .select()
          .single();
        if (data) {
          setLogs((prev) => [...prev.filter((log) => log.habit_id !== editingHabit.id), data]);
        }
      }
    }

    setEditingHabit(null);
    showToast("Entry saved", "success");
  };
  const editingInputType = editingHabit ? getHabitInputType(editingHabit.input_type) : "number";

  const stats = [
    {
      label: "Habits Completed",
      value: `${completedCount}/${habits.length}`,
      change: completedCount === habits.length ? "All done!" : `${habits.length - completedCount} remaining`,
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      label: "Deep Work Hours",
      value: `${deepWorkToday}h`,
      change: deepWorkToday >= 4.5 ? "Target hit ✓" : "Session active",
      icon: Clock,
      color: "text-blue-400",
    },
    {
      label: "Revenue (MTD)",
      value: `RM ${revenueMTD.toLocaleString()}`,
      change: `${Math.round((revenueMTD / revenueTarget) * 100)}% of target`,
      icon: TrendingUp,
      color: "text-[var(--color-gold)]",
    },
    {
      label: "Current Streak",
      value: `${streak} days`,
      change: streak > 20 ? "Personal best!" : "Keep going!",
      icon: Flame,
      color: "text-orange-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Daily Identity Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[#141414] via-[#111] to-[#0d0d0d] p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-[var(--color-gold)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
              Daily Identity
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
            Who am I becoming today?
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
            I am a disciplined operator who executes with precision. Every rep, every page,
            every ringgit earned moves me closer to the man I&apos;m building.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-subtle)] transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Two Column: Checklist + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Checklist */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-lg font-semibold text-white">Today&apos;s Ops</h2>
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">
              {completedCount}/{habits.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[var(--color-surface-hover)] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-gold-dim)] to-[var(--color-gold)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ul className="space-y-3">
            {habits.map((habit) => {
              const isDone = isHabitDone(habit);
              const currentValue = getHabitCurrentValue(habit);
              return (
                <li key={habit.id} className="flex items-center gap-3">
                  <button
                    onClick={() => openInputForHabit(habit)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${isDone
                        ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-gold-dim)]"
                      }`}
                  >
                    {isDone && (
                      <svg
                        className="w-3 h-3 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
                    <span
                      className={`text-sm truncate ${isDone
                          ? "text-[var(--color-text-muted)] line-through"
                          : "text-[var(--color-text-primary)]"
                        }`}
                    >
                      {habit.name}
                    </span>
                    {currentValue ? (
                      <span className="text-xs text-[var(--color-text-secondary)] shrink-0">{currentValue}</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-[var(--color-gold)]" />
            <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
          </div>
          <ul className="space-y-4">
            {recentActivity.map((a, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 pb-4 border-b border-[var(--color-border-subtle)] last:border-0 last:pb-0"
              >
                <span className="text-lg">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-[var(--color-text-primary)]">{a.text}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title={`Log ${editingHabit?.name || ""}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {editingInputType === "time"
              ? "Enter time for today"
              : `Enter value for today (${editingHabit?.unit || "units"})`}
          </p>
          {editingInputType === "time" ? (
            <input
              type="time"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") saveHabitInput(); }}
            />
          ) : (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Target: ${editingHabit?.target_value || 0}`}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              autoFocus
              step="0.5"
              onKeyDown={(e) => { if (e.key === "Enter") saveHabitInput(); }}
            />
          )}
          <button
            onClick={saveHabitInput}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
