"use client";

import { useState } from "react";
import {
    Flame,
    Sun,
    BookOpen,
    Brain,
    Clock,
    Smartphone,
    Dumbbell,
    Beef,
    Trophy,
    Check,
    X,
} from "lucide-react";

// --- Habit Matrix ---
interface Habit {
    id: string;
    name: string;
    icon: React.ElementType;
    streak: number;
    weekLog: boolean[];
    category: string;
}

const defaultHabits: Habit[] = [
    {
        id: "wakeup",
        name: "5 AM Wakeup",
        icon: Sun,
        streak: 27,
        weekLog: [true, true, true, true, true, false, false],
        category: "90-Day Challenge",
    },
    {
        id: "solat",
        name: "Solat Jemaah",
        icon: Flame,
        streak: 45,
        weekLog: [true, true, true, true, true, true, false],
        category: "Ibadah",
    },
    {
        id: "quran",
        name: "Quran (Pages Read)",
        icon: BookOpen,
        streak: 19,
        weekLog: [true, true, false, true, true, true, false],
        category: "Ibadah",
    },
    {
        id: "muraqabah",
        name: "Muraqabah (Minutes)",
        icon: Brain,
        streak: 12,
        weekLog: [true, false, true, true, true, false, false],
        category: "Reflection",
    },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// --- Deep Work ---
interface DeepWorkSession {
    id: number;
    date: string;
    hours: number;
    focus: string;
    completed: boolean;
}

const deepWorkSessions: DeepWorkSession[] = [
    { id: 1, date: "Feb 25", hours: 4.5, focus: "Client Proposal — Attic KL", completed: true },
    { id: 2, date: "Feb 24", hours: 4.5, focus: "Facebook Ads Campaign Build", completed: true },
    { id: 3, date: "Feb 23", hours: 3.0, focus: "Website Redesign — Phase 2", completed: false },
    { id: 4, date: "Feb 22", hours: 4.5, focus: "SEO Audit — Construction Firm", completed: true },
];

// --- Workouts ---
interface Workout {
    id: number;
    type: string;
    date: string;
    duration: string;
    notes: string;
}

const workouts: Workout[] = [
    { id: 1, type: "Muay Thai", date: "Feb 25", duration: "60 min", notes: "Pad work + sparring" },
    { id: 2, type: "Heavy Lifting", date: "Feb 24", duration: "75 min", notes: "Push day — bench, OHP, dips" },
    { id: 3, type: "Marathon Prep", date: "Feb 23", duration: "45 min", notes: "Tempo run — 8km @ 5:30/km" },
    { id: 4, type: "Heavy Lifting", date: "Feb 22", duration: "70 min", notes: "Pull day — deadlift, rows" },
];

const workoutTypeColors: Record<string, string> = {
    "Marathon Prep": "text-blue-400 bg-blue-400/10",
    "Heavy Lifting": "text-orange-400 bg-orange-400/10",
    "Muay Thai": "text-red-400 bg-red-400/10",
};

export default function ForgePage() {
    const [habits, setHabits] = useState(defaultHabits);
    const [screenTime, setScreenTime] = useState("2.5");
    const [omadDone, setOmadDone] = useState(true);
    const [wholeFoodsFirst, setWholeFoodsFirst] = useState(true);

    const toggleHabitDay = (habitId: string, dayIdx: number) => {
        setHabits((prev) =>
            prev.map((h) =>
                h.id === habitId
                    ? {
                        ...h,
                        weekLog: h.weekLog.map((v, i) => (i === dayIdx ? !v : v)),
                    }
                    : h
            )
        );
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Flame className="w-6 h-6 text-[var(--color-gold)]" />
                    The Forge
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Forge discipline through daily execution. Track every rep, every page, every minute.
                </p>
            </div>

            {/* ─── HABIT MATRIX ─── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Habit Matrix</h2>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold-glow)] text-[var(--color-gold)]">
                        90-Day Challenge Active
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--color-border)]">
                                <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider w-64">
                                    Habit
                                </th>
                                {dayLabels.map((d) => (
                                    <th
                                        key={d}
                                        className="px-3 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider text-center w-16"
                                    >
                                        {d}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider text-center">
                                    Streak
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr
                                    key={habit.id}
                                    className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <habit.icon className="w-4 h-4 text-[var(--color-gold)]" />
                                            <div>
                                                <p className="text-sm font-medium text-white">{habit.name}</p>
                                                <p className="text-xs text-[var(--color-text-muted)]">{habit.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {habit.weekLog.map((done, idx) => (
                                        <td key={idx} className="px-3 py-4 text-center">
                                            <button
                                                onClick={() => toggleHabitDay(habit.id, idx)}
                                                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 mx-auto ${done
                                                        ? "bg-[var(--color-gold)] border-[var(--color-gold)] text-black"
                                                        : "border-[var(--color-border)] hover:border-[var(--color-gold-dim)] text-transparent"
                                                    }`}
                                            >
                                                {done ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Trophy className="w-4 h-4 text-[var(--color-gold)]" />
                                            <span className="text-sm font-bold text-white">{habit.streak}d</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── DEEP WORK ENGINE + PHONE SCREEN TIME ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Deep Work Sessions */}
                <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-gold)]" />
                            <h2 className="text-lg font-semibold text-white">Deep Work Engine</h2>
                        </div>
                        <button className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            + Log Session
                        </button>
                    </div>
                    <div className="space-y-3">
                        {deepWorkSessions.map((s) => (
                            <div
                                key={s.id}
                                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors"
                            >
                                <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.completed
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}
                                >
                                    {s.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{s.focus}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{s.date}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-lg font-bold text-white">{s.hours}h</p>
                                    <p
                                        className={`text-xs ${s.hours >= 4.5 ? "text-emerald-400" : "text-[var(--color-warning)]"
                                            }`}
                                    >
                                        {s.hours >= 4.5 ? "Target hit" : "Below target"}
                                    </p>
                                </div>
                            </div>
                        ))}
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
                                onChange={(e) => setScreenTime(e.target.value)}
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
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400">
                                    🎯 Under control
                                </span>
                            ) : parseFloat(screenTime) <= 4 ? (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400">
                                    ⚠️ Watch it
                                </span>
                            ) : (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 text-red-400">
                                    🚨 Too high
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── PHYSICAL & DIET ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Workout Logger */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-[var(--color-gold)]" />
                            <h2 className="text-lg font-semibold text-white">Workout Log</h2>
                        </div>
                        <button className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            + Log Workout
                        </button>
                    </div>
                    <div className="space-y-3">
                        {workouts.map((w) => (
                            <div
                                key={w.id}
                                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]"
                            >
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${workoutTypeColors[w.type] || "text-gray-400 bg-gray-400/10"
                                        }`}
                                >
                                    {w.type}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{w.notes}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {w.date} · {w.duration}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OMAD Compliance */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Beef className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">OMAD Compliance</h2>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] mb-4">
                        <div>
                            <p className="text-sm font-medium text-white">One Meal A Day</p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Did you eat only one main meal today?
                            </p>
                        </div>
                        <button
                            onClick={() => setOmadDone(!omadDone)}
                            className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${omadDone ? "bg-[var(--color-gold)]" : "bg-[var(--color-border)]"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${omadDone ? "left-5.5" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Sub-checklist */}
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Nutrition Checklist
                        </p>
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border)] transition-colors">
                            <input
                                type="checkbox"
                                checked={wholeFoodsFirst}
                                onChange={() => setWholeFoodsFirst(!wholeFoodsFirst)}
                                className="sr-only"
                            />
                            <div
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${wholeFoodsFirst
                                        ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                                        : "border-[var(--color-border)]"
                                    }`}
                            >
                                {wholeFoodsFirst && (
                                    <Check className="w-3 h-3 text-black" />
                                )}
                            </div>
                            <span className="text-sm text-white">Whole foods eaten before junk food</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border)] transition-colors">
                            <input type="checkbox" defaultChecked className="sr-only" />
                            <div className="w-5 h-5 rounded-md border-2 bg-[var(--color-gold)] border-[var(--color-gold)] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 text-black" />
                            </div>
                            <span className="text-sm text-white">Protein target hit (min 120g)</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border)] transition-colors">
                            <input type="checkbox" className="sr-only" />
                            <div className="w-5 h-5 rounded-md border-2 border-[var(--color-border)] flex items-center justify-center shrink-0" />
                            <span className="text-sm text-white">Water intake 3L+</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
