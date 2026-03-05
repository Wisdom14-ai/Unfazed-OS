"use client";

import Link from "next/link";
import { Zap, Target, Brain, Flame, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-gold)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Unfazed<span className="text-[var(--color-gold)]"> OS</span>
          </span>
        </div>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-[var(--color-gold)] text-black text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24">
        <div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--color-gold)] opacity-[0.05] rounded-full blur-[100px]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-6">
              <Flame className="w-3.5 h-3.5 text-[var(--color-gold)]" />
              <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-widest">
                Your Personal Operating System
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-5 max-w-3xl">
              Command Your Day.{" "}
              <span className="text-[var(--color-gold)]">Dominate Your Life.</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
              The premium productivity dashboard for high-performers. Track habits, deep work,
              revenue, and mindset — all in one sleek command center.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-7 py-3.5 bg-[var(--color-gold)] text-black font-semibold rounded-xl hover:brightness-110 transition-all text-sm"
              >
                Enter Command Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Target,
                title: "Habit Ops",
                desc: "Daily checklist with streaks and identity reinforcement.",
              },
              {
                icon: Brain,
                title: "Deep Work",
                desc: "Track focused hours. Build your concentration muscle.",
              },
              {
                icon: Sparkles,
                title: "Alchemy",
                desc: "Transform your mindset with journaling and reflection.",
              },
              {
                icon: CheckCircle2,
                title: "Revenue Tracking",
                desc: "Monitor income and hit your monthly financial targets.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-card-hover)] transition-all duration-200"
              >
                <f.icon className="w-6 h-6 text-[var(--color-gold)] mb-4" />
                <h3 className="text-base font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] px-6 py-6 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Unfazed OS — Built for operators, by an operator.
        </p>
      </footer>
    </div>
  );
}
