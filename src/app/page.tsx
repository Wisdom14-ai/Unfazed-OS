"use client";

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

const stats = [
  {
    label: "Habits Completed",
    value: "6/8",
    change: "+2 vs yesterday",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  {
    label: "Deep Work Hours",
    value: "4.5h",
    change: "Session complete",
    icon: Clock,
    color: "text-blue-400",
  },
  {
    label: "Revenue (MTD)",
    value: "RM 38,400",
    change: "64% of target",
    icon: TrendingUp,
    color: "text-[var(--color-gold)]",
  },
  {
    label: "Current Streak",
    value: "27 days",
    change: "Personal best!",
    icon: Flame,
    color: "text-orange-400",
  },
];

const todayChecklist = [
  { text: "5 AM Wakeup", done: true },
  { text: "Solat Subuh Jemaah", done: true },
  { text: "Quran — 5 pages", done: true },
  { text: "Deep Work Session (4.5h)", done: true },
  { text: "10 WhatsApp Outreach", done: false },
  { text: "Muay Thai Training", done: false },
  { text: "Evening Muraqabah", done: false },
  { text: "Journal Entry", done: false },
];

const recentActivity = [
  { time: "6:45 AM", text: "Completed Quran reading — 5 pages", icon: "📖" },
  { time: "7:00 AM", text: "Deep work session started", icon: "🔥" },
  { time: "11:30 AM", text: "Deep work session ended — 4.5h logged", icon: "✅" },
  { time: "12:00 PM", text: "New client inquiry — Construction sector", icon: "💰" },
  { time: "1:15 PM", text: "Closed deal — RM 4,200 revenue", icon: "🎯" },
];

export default function Dashboard() {
  const completedCount = todayChecklist.filter((t) => t.done).length;
  const progress = (completedCount / todayChecklist.length) * 100;

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
              {completedCount}/{todayChecklist.length}
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
            {todayChecklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${item.done
                      ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-gold-dim)]"
                    }`}
                >
                  {item.done && (
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
                </div>
                <span
                  className={`text-sm ${item.done
                      ? "text-[var(--color-text-muted)] line-through"
                      : "text-[var(--color-text-primary)]"
                    }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
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
    </div>
  );
}
