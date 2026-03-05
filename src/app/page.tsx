"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Target,
  Brain,
  Flame,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Swords,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  Users,
  Star,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Habit Ops",
    desc: "Full-month habit matrix with daily tracking, streaks, and identity reinforcement. Boolean and numeric habit types with targets.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Clock,
    title: "Deep Work Engine",
    desc: "Log focused sessions, track daily hours, and measure performance against your 4.5h target. Build unstoppable concentration.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Swords,
    title: "War Room",
    desc: "Pipeline CRM with lead tracking, deal stages, and revenue forecasting. Full financial overview with income & expense logging.",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
  {
    icon: Sparkles,
    title: "Alchemy",
    desc: "Transform your mindset through journaling prompts, book notes with extraction models, and daily reflection practices.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    desc: "Monitor income streams, track monthly targets, and visualize your financial trajectory with real-time MTD calculations.",
    color: "text-[var(--color-gold)]",
    bg: "bg-[var(--color-gold-glow)]",
  },
  {
    icon: Flame,
    title: "Body Protocol",
    desc: "Workout logger, OMAD compliance, nutrition checklist, protein targets, and screen time monitoring — all in one dashboard.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "RM 0",
    period: "forever",
    desc: "Get started and explore the basics",
    features: [
      "3 habit tracking slots",
      "Basic dashboard view",
      "7-day history",
      "1 deep work session/day",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
    href: "/login",
  },
  {
    name: "Monthly",
    price: "RM 30",
    period: "/month",
    desc: "Full access for serious operators",
    features: [
      "Unlimited habit tracking",
      "All modules unlocked",
      "Full history & analytics",
      "Unlimited deep work sessions",
      "War Room CRM access",
      "Alchemy journaling suite",
      "Priority email support",
    ],
    cta: "Subscribe Monthly",
    popular: true,
    href: "/login",
  },
  {
    name: "Yearly",
    price: "RM 300",
    period: "/year",
    desc: "Save 17% — commit to the grind",
    features: [
      "Everything in Monthly",
      "Custom dashboard themes",
      "Advanced analytics",
      "Data export (CSV)",
      "Priority support",
    ],
    cta: "Subscribe Yearly",
    popular: false,
    href: "/login",
    badge: "Save 17%",
  },
  {
    name: "Lifetime",
    price: "RM 500",
    period: "one-time",
    desc: "Pay once. Own forever. No limits.",
    features: [
      "Everything in Yearly",
      "All future features included",
      "Lifetime updates",
      "Founding member badge",
      "Direct founder access",
      "Beta feature access",
    ],
    cta: "Get Lifetime Access",
    popular: false,
    href: "/login",
    badge: "Best Value",
  },
];

const faqs = [
  {
    q: "Is my data secure?",
    a: "Absolutely. Your data is stored on enterprise-grade Supabase infrastructure with Row-Level Security (RLS). Only you can see your data — no one else, not even us.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly and yearly plans can be cancelled at any time. You'll retain access until the end of your billing period. Lifetime is a one-time purchase — no cancellation needed.",
  },
  {
    q: "What payment methods do you support?",
    a: "We use Billplz for payment processing, which supports FPX (all major Malaysian banks), credit/debit cards, and e-wallets. Safe, fast, and local.",
  },
  {
    q: "What happens if I exceed the free plan limits?",
    a: "You won't lose any data. You'll be prompted to upgrade when you try to add more than 3 habits or access premium features. Upgrade anytime to unlock everything.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Unfazed OS is a web app that works on any device — desktop, tablet, or phone. Just sign in with Google and start operating.",
  },
  {
    q: "Is there a mobile app?",
    a: "Unfazed OS is fully responsive and works beautifully on mobile browsers. A dedicated mobile app is on the roadmap for 2026.",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign Up in Seconds",
    desc: "One-click Google sign-in. No forms, no friction. You're in your command center within 10 seconds.",
    icon: Users,
  },
  {
    step: "02",
    title: "Configure Your Protocol",
    desc: "Set up your habits, deep work targets, revenue goals, and journaling prompts. Your OS, your rules.",
    icon: Target,
  },
  {
    step: "03",
    title: "Execute & Dominate",
    desc: "Track daily, review weekly, iterate monthly. Watch your consistency compound into extraordinary results.",
    icon: Crown,
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      {/* ─── STICKY NAV ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-background)]/80 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-gold)] flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Unfazed<span className="text-[var(--color-gold)]"> OS</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden sm:block text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#features"
              className="hidden sm:block text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              Features
            </a>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-[var(--color-gold)] text-black text-sm font-semibold rounded-lg hover:brightness-110 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-gold)] opacity-[0.04] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-blue-500 opacity-[0.03] rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-8">
            <Flame className="w-3.5 h-3.5 text-[var(--color-gold)]" />
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-widest">
              The Operating System for High-Performers
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6">
            Command Your Day.{" "}
            <span className="bg-gradient-to-r from-[var(--color-gold)] to-[#e8c84e] bg-clip-text text-transparent">
              Dominate Your Life.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The premium productivity dashboard that lets you track habits, log deep work,
            manage revenue, and master your mindset — all in one sleek, dark command center
            built for operators who refuse to settle.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/login"
              className="group flex items-center gap-2 px-8 py-4 bg-[var(--color-gold)] text-black font-semibold rounded-xl hover:brightness-110 transition-all text-sm shadow-lg shadow-[var(--color-gold)]/20"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-surface)] hover:text-white transition-all text-sm"
            >
              See Features
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Bank-grade security</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Setup in 10 seconds</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Star className="w-4 h-4 text-[var(--color-gold)]" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="border-y border-[var(--color-border)] py-8 bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16 px-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">10+</p>
            <p className="text-xs text-[var(--color-text-muted)]">Built-in Modules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-xs text-[var(--color-text-muted)]">Data Privacy</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">24/7</p>
            <p className="text-xs text-[var(--color-text-muted)]">Always Available</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-gold)]">RM 0</p>
            <p className="text-xs text-[var(--color-text-muted)]">To Get Started</p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]">
              Everything You Need
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              Six Modules. One Operating System.
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Each module is crafted to work together. Your habits fuel your deep work. Your deep work generates revenue. Your journal captures the wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-7 hover:border-[var(--color-gold-dim)]/30 transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--color-gold)] transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              Up and Running in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-gold-glow)] mb-5">
                  <s.icon className="w-7 h-7 text-[var(--color-gold)]" />
                </div>
                <div className="text-xs font-bold text-[var(--color-gold)] mb-2">
                  STEP {s.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              Invest in Your Future Self
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
              Start free, upgrade when you&apos;re ready. Every plan includes Supabase-powered data security and Google OAuth sign-in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-7 flex flex-col transition-all duration-300 ${plan.popular
                    ? "border-[var(--color-gold)] bg-gradient-to-b from-[var(--color-gold-glow)] to-[var(--color-card)] shadow-lg shadow-[var(--color-gold)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-gold-dim)]/30"
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-gold)] text-black text-xs font-bold">
                    {plan.badge}
                  </div>
                )}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-gold)] text-black text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-[var(--color-text-muted)] ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-gold)] shrink-0 mt-0.5" />
                      <span className="text-sm text-[var(--color-text-secondary)]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-all ${plan.popular
                      ? "bg-[var(--color-gold)] text-black hover:brightness-110"
                      : "border border-[var(--color-border)] text-white hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-gold-dim)]"
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 md:px-12 py-20 md:py-28 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-[var(--color-gold)]">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              Got Questions?
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--color-gold)] opacity-[0.04] rounded-full blur-[120px]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
                Ready to Become{" "}
                <span className="text-[var(--color-gold)]">Unfazed</span>?
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-10 max-w-lg mx-auto">
                Join operators who track every rep, every hour, every ringgit.
                Build the identity of someone who never breaks the chain.
              </p>
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-gold)] text-black font-semibold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--color-gold)]/20"
              >
                Launch Your Command Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold text-white">
                  Unfazed<span className="text-[var(--color-gold)]"> OS</span>
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
                The premium productivity operating system for high-performers.
                Built for operators, by an operator. Track. Execute. Dominate.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    Privacy Policy
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} Unfazed OS — Built for operators, by an operator.
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Payments powered by Billplz 🇲🇾
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
