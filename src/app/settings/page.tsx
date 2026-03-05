"use client";

import { useState } from "react";
import {
    Settings as SettingsIcon,
    User,
    Sliders,
    CreditCard,
    Check,
    Crown,
    Zap,
    Save,
    Camera,
    Mail,
    Phone,
    Globe,
    Plus,
    Trash2,
    Star,
} from "lucide-react";

type Tab = "profile" | "habits" | "billing";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "habits", label: "Custom Habits", icon: Sliders },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
];

// Free vs Pro comparison
const tiers = [
    {
        name: "Free",
        price: "RM 0",
        period: "/forever",
        current: false,
        features: [
            "5 habits tracking",
            "Basic journal",
            "7-day streak history",
            "1 revenue goal",
        ],
        missing: [
            "Unlimited habits",
            "Deep Work engine",
            "Full P&L & Pipeline",
            "Book Notes library",
            "Priority support",
            "Data export",
        ],
    },
    {
        name: "Unfazed Pro",
        price: "RM 29",
        period: "/month",
        current: true,
        features: [
            "Unlimited habits tracking",
            "Deep Work engine",
            "Full P&L & Pipeline CRM",
            "Emotional Consciousness journal",
            "Book Notes & Mental Models",
            "Advanced analytics",
            "Data export (CSV/PDF)",
            "Priority support",
        ],
        missing: [],
    },
];

interface CustomHabit {
    id: string;
    name: string;
    category: string;
    frequency: string;
}

const defaultCustomHabits: CustomHabit[] = [
    { id: "1", name: "5 AM Wakeup", category: "90-Day Challenge", frequency: "Daily" },
    { id: "2", name: "Solat Jemaah", category: "Ibadah", frequency: "5x Daily" },
    { id: "3", name: "Quran (Pages Read)", category: "Ibadah", frequency: "Daily" },
    { id: "4", name: "Muraqabah (Minutes)", category: "Reflection", frequency: "Daily" },
    { id: "5", name: "Cold Shower", category: "Discipline", frequency: "Daily" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [habits, setHabits] = useState(defaultCustomHabits);

    const removeHabit = (id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-[var(--color-gold)]" />
                    Settings
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Manage your profile, customize habits, and control your subscription.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? "bg-[var(--color-gold)] text-black"
                                : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-hover)]"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── PROFILE TAB ─── */}
            {activeTab === "profile" && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dim)] flex items-center justify-center">
                                <User className="w-8 h-8 text-black" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] transition-colors">
                                <Camera className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Commander</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Crown className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                                <span className="text-xs font-medium text-[var(--color-gold)]">Unfazed Pro</span>
                            </div>
                        </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Commander"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                Display Name
                            </label>
                            <input
                                type="text"
                                defaultValue="Commander"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                <Mail className="w-3 h-3" /> Email
                            </label>
                            <input
                                type="email"
                                defaultValue="commander@unfazed.io"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                <Phone className="w-3 h-3" /> Phone
                            </label>
                            <input
                                type="tel"
                                defaultValue="+60 12-345 6789"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                <Globe className="w-3 h-3" /> Timezone
                            </label>
                            <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                <option>Asia/Kuala_Lumpur (GMT+8)</option>
                                <option>Asia/Singapore (GMT+8)</option>
                                <option>Asia/Dubai (GMT+4)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="px-5 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* ─── CUSTOM HABITS TAB ─── */}
            {activeTab === "habits" && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Custom Habits Configuration</h2>
                        <button className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            Add Habit
                        </button>
                    </div>
                    <div className="divide-y divide-[var(--color-border-subtle)]">
                        {habits.map((habit) => (
                            <div
                                key={habit.id}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--color-surface-hover)] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-gold-glow)] flex items-center justify-center shrink-0">
                                    <Star className="w-4 h-4 text-[var(--color-gold)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{habit.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {habit.category} · {habit.frequency}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeHabit(habit.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── BILLING TAB ─── */}
            {activeTab === "billing" && (
                <div className="space-y-6">
                    {/* Current plan */}
                    <div className="rounded-xl border border-[var(--color-gold)]/30 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-[var(--color-gold)]" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">
                                Current Plan
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Unfazed Pro</h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                            Your subscription renews on March 1, 2026 · RM 29/month
                        </p>
                    </div>

                    {/* Tier comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`rounded-xl border p-6 ${tier.current
                                        ? "border-[var(--color-gold)]/30 bg-[var(--color-card)]"
                                        : "border-[var(--color-border)] bg-[var(--color-card)]"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                                        <div className="flex items-baseline gap-0.5 mt-1">
                                            <span className="text-3xl font-bold text-white">{tier.price}</span>
                                            <span className="text-sm text-[var(--color-text-muted)]">{tier.period}</span>
                                        </div>
                                    </div>
                                    {tier.current && (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-gold)] text-black">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-2.5 mb-5">
                                    {tier.features.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-[var(--color-gold)] shrink-0" />
                                            <span className="text-[var(--color-text-primary)]">{f}</span>
                                        </li>
                                    ))}
                                    {tier.missing.map((f, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="w-4 h-4 rounded-full border border-[var(--color-border)] shrink-0" />
                                            <span className="text-[var(--color-text-muted)]">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {tier.current ? (
                                    <button className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
                                        Manage Subscription
                                    </button>
                                ) : (
                                    <button className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                                        Downgrade to Free
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
