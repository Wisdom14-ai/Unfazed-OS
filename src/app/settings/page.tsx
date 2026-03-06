"use client";

import { useEffect, useState, useCallback } from "react";
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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import type { Tables } from "@/lib/database.types";
import {
    getHabitInputType,
    getHabitTimeMode,
    type HabitInputType,
    type HabitTimeMode,
} from "@/lib/habitTracking";

type Tab = "profile" | "habits" | "billing";
type UserProfile = Tables<"user_profile">;
type Habit = Tables<"habits">;

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "User Profile", icon: User },
    { id: "habits", label: "Custom Habits", icon: Sliders },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
];

const tiers = [
    {
        name: "Free",
        price: "RM 0",
        period: "/forever",
        current: false,
        features: ["5 habits tracking", "Basic journal", "7-day streak history", "1 revenue goal"],
        missing: ["Unlimited habits", "Deep Work engine", "Full P&L & Pipeline", "Book Notes library", "Priority support", "Data export"],
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

const iconOptions = ["star", "sun", "moon", "flame", "brain", "book-open", "dumbbell", "clock", "sparkles", "phone", "graduation-cap", "smartphone"];
const categoryOptions = ["90-Day Challenge", "Ibadah", "Reflection", "Health", "Physical", "Business", "Growth", "Productivity", "Discipline"];

export default function SettingsPage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile form
    const [fullName, setFullName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");

    // Habit modal
    const [showHabitModal, setShowHabitModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [habitForm, setHabitForm] = useState({
        name: "",
        icon: "star",
        category: "General",
        input_type: "boolean" as HabitInputType,
        target_value: "1",
        unit: "",
        time_mode: "clock" as HabitTimeMode,
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        const [profileRes, habitsRes] = await Promise.all([
            supabase.from("user_profile").select("*").limit(1).single(),
            supabase.from("habits").select("*").order("sort_order"),
        ]);
        if (profileRes.data) {
            setProfile(profileRes.data);
            setFullName(profileRes.data.full_name);
            setDisplayName(profileRes.data.display_name);
            setEmail(profileRes.data.email || "");
            setPhone(profileRes.data.phone || "");
            setTimezone(profileRes.data.timezone || "Asia/Kuala_Lumpur");
        }
        setHabits(habitsRes.data || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const saveProfile = async () => {
        if (!profile) return;
        setSaving(true);
        const { error } = await supabase
            .from("user_profile")
            .update({
                full_name: fullName,
                display_name: displayName,
                email,
                phone,
                timezone,
                updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);

        if (!error) {
            showToast("Profile saved! ✓", "success");
        } else {
            showToast("Failed to save profile", "error");
        }
        setSaving(false);
    };

    const openAddHabit = () => {
        setEditingHabit(null);
        setHabitForm({
            name: "",
            icon: "star",
            category: "General",
            input_type: "boolean",
            target_value: "1",
            unit: "",
            time_mode: "clock",
        });
        setShowHabitModal(true);
    };

    const openEditHabit = (habit: Habit) => {
        setEditingHabit(habit);
        setHabitForm({
            name: habit.name,
            icon: habit.icon,
            category: habit.category,
            input_type: getHabitInputType(habit.input_type),
            target_value: String(habit.target_value || 1),
            unit: habit.unit || "",
            time_mode: getHabitTimeMode(habit.time_mode),
        });
        setShowHabitModal(true);
    };

    const saveHabit = async () => {
        if (!habitForm.name) {
            showToast("Habit name is required", "error");
            return;
        }
        const payload = {
            name: habitForm.name,
            icon: habitForm.icon,
            category: habitForm.category,
            input_type: habitForm.input_type,
            target_value: habitForm.input_type === "number" ? (parseFloat(habitForm.target_value) || 1) : null,
            unit: habitForm.input_type === "number" ? habitForm.unit : null,
            time_mode: habitForm.input_type === "time" ? habitForm.time_mode : "clock",
        };

        if (editingHabit) {
            const { data, error } = await supabase.from("habits").update(payload).eq("id", editingHabit.id).select().single();
            if (!error && data) {
                setHabits((prev) => prev.map((h) => (h.id === data.id ? data : h)));
                showToast("Habit updated!", "success");
            }
        } else {
            const maxOrder = habits.reduce((max, h) => Math.max(max, h.sort_order), 0);
            const { data, error } = await supabase.from("habits").insert({ ...payload, sort_order: maxOrder + 1 }).select().single();
            if (!error && data) {
                setHabits((prev) => [...prev, data]);
                showToast("Habit added! 🎯", "success");
            }
        }
        setShowHabitModal(false);
    };

    const toggleHabitActive = async (habit: Habit) => {
        const newActive = !habit.is_active;
        const { data } = await supabase.from("habits").update({ is_active: newActive }).eq("id", habit.id).select().single();
        if (data) {
            setHabits((prev) => prev.map((h) => (h.id === data.id ? data : h)));
            showToast(newActive ? "Habit activated" : "Habit deactivated", "info");
        }
    };

    const removeHabit = async (id: string) => {
        await supabase.from("habits").delete().eq("id", id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
        showToast("Habit deleted", "info");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
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
                            <h3 className="text-lg font-semibold text-white">{displayName || "Commander"}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Crown className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                                <span className="text-xs font-medium text-[var(--color-gold)]">Unfazed Pro</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Display Name</label>
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider"><Mail className="w-3 h-3" /> Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider"><Phone className="w-3 h-3" /> Phone</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider"><Globe className="w-3 h-3" /> Timezone</label>
                            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (GMT+8)</option>
                                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={saveProfile} disabled={saving} className="px-5 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center gap-2 disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}

            {/* ─── CUSTOM HABITS TAB ─── */}
            {activeTab === "habits" && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Custom Habits Configuration</h2>
                        <button onClick={openAddHabit} className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors flex items-center gap-1.5">
                            <Plus className="w-4 h-4" /> Add Habit
                        </button>
                    </div>
                    <div className="divide-y divide-[var(--color-border-subtle)]">
                        {habits.map((habit) => (
                            <div key={habit.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-[var(--color-surface-hover)] transition-colors ${!habit.is_active ? "opacity-50" : ""}`}>
                                <div className="w-8 h-8 rounded-lg bg-[var(--color-gold-glow)] flex items-center justify-center shrink-0">
                                    <Star className="w-4 h-4 text-[var(--color-gold)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{habit.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {habit.category} · {getHabitInputType(habit.input_type) === "boolean"
                                            ? "Toggle"
                                            : getHabitInputType(habit.input_type) === "number"
                                                ? `Number (${habit.unit || "units"})`
                                                : `Time (${getHabitTimeMode(habit.time_mode) === "sleep" ? "Sleep" : "Regular"})`}
                                        {habit.target_value && getHabitInputType(habit.input_type) === "number" ? ` · Target: ${habit.target_value}` : ""}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleHabitActive(habit)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${habit.is_active
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                                            }`}
                                    >
                                        {habit.is_active ? "Active" : "Inactive"}
                                    </button>
                                    <button onClick={() => openEditHabit(habit)} className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
                                        Edit
                                    </button>
                                    <button onClick={() => removeHabit(habit.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
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
                    <div className="rounded-xl border border-[var(--color-gold)]/30 bg-gradient-to-br from-[var(--color-gold)]/5 to-transparent p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-[var(--color-gold)]" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)]">Current Plan</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Unfazed Pro</h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Your subscription renews on March 1, 2026 · RM 29/month</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tiers.map((tier) => (
                            <div key={tier.name} className={`rounded-xl border p-6 ${tier.current ? "border-[var(--color-gold)]/30 bg-[var(--color-card)]" : "border-[var(--color-border)] bg-[var(--color-card)]"}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                                        <div className="flex items-baseline gap-0.5 mt-1">
                                            <span className="text-3xl font-bold text-white">{tier.price}</span>
                                            <span className="text-sm text-[var(--color-text-muted)]">{tier.period}</span>
                                        </div>
                                    </div>
                                    {tier.current && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-gold)] text-black">ACTIVE</span>}
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

            {/* Add/Edit Habit Modal */}
            <Modal isOpen={showHabitModal} onClose={() => setShowHabitModal(false)} title={editingHabit ? "Edit Habit" : "Add New Habit"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Habit Name</label>
                        <input type="text" value={habitForm.name} onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })} placeholder="e.g. Cold Shower" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Category</label>
                            <select value={habitForm.category} onChange={(e) => setHabitForm({ ...habitForm, category: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                {categoryOptions.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Icon</label>
                            <select value={habitForm.icon} onChange={(e) => setHabitForm({ ...habitForm, icon: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                {iconOptions.map((i) => <option key={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setHabitForm({ ...habitForm, input_type: "boolean" })} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${habitForm.input_type === "boolean" ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                                Toggle (Yes/No)
                            </button>
                            <button onClick={() => setHabitForm({ ...habitForm, input_type: "number" })} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${habitForm.input_type === "number" ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                                Number Input
                            </button>
                            <button onClick={() => setHabitForm({ ...habitForm, input_type: "time" })} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${habitForm.input_type === "time" ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]"}`}>
                                Time
                            </button>
                        </div>
                    </div>
                    {habitForm.input_type === "number" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Target Value</label>
                                <input type="number" value={habitForm.target_value} onChange={(e) => setHabitForm({ ...habitForm, target_value: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Unit</label>
                                <input type="text" value={habitForm.unit} onChange={(e) => setHabitForm({ ...habitForm, unit: e.target.value })} placeholder="e.g. pages, hours" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                            </div>
                        </div>
                    )}
                    {habitForm.input_type === "time" && (
                        <>
                            <div>
                                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Time Mode</label>
                                <select
                                    value={habitForm.time_mode}
                                    onChange={(e) => setHabitForm({ ...habitForm, time_mode: e.target.value as HabitTimeMode })}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none"
                                >
                                    <option value="clock">Regular Time</option>
                                    <option value="sleep">Sleep Time (midnight wrap)</option>
                                </select>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                                Existing logs stay unchanged. Time averages use only new time entries.
                            </p>
                        </>
                    )}
                    <button onClick={saveHabit} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                        {editingHabit ? "Update Habit" : "Add Habit"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
