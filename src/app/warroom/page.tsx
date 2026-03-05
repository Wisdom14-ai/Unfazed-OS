"use client";

import { useState } from "react";
import {
    Swords,
    TrendingUp,
    DollarSign,
    ArrowDown,
    ArrowUp,
    Plus,
    MessageCircle,
    Presentation,
    Building2,
    PaintBucket,
    Users,
    Tag,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

// --- Revenue Data ---
const revenueTarget = 60000;
const currentRevenue = 38400;
const revenuePercentage = Math.round((currentRevenue / revenueTarget) * 100);

const weeklyRevenue = [
    { week: "W1", amount: 8200 },
    { week: "W2", amount: 12400 },
    { week: "W3", amount: 9800 },
    { week: "W4", amount: 8000 },
];

// --- P&L Data ---
interface Transaction {
    id: number;
    date: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    category: string;
}

const transactions: Transaction[] = [
    { id: 1, date: "Feb 25", description: "Website project — Attic KL", type: "income", amount: 4200, category: "Project" },
    { id: 2, date: "Feb 24", description: "Facebook Ads spend", type: "expense", amount: 1500, category: "Marketing" },
    { id: 3, date: "Feb 23", description: "SEO retainer — BuildCraft Sdn Bhd", type: "income", amount: 3000, category: "Retainer" },
    { id: 4, date: "Feb 22", description: "Canva Pro subscription", type: "expense", amount: 55, category: "Tools" },
    { id: 5, date: "Feb 21", description: "Social media management — IDesign Co", type: "income", amount: 2800, category: "Retainer" },
    { id: 6, date: "Feb 20", description: "Hosting & domains", type: "expense", amount: 180, category: "Infrastructure" },
    { id: 7, date: "Feb 19", description: "Google Ads setup — MegaBuild", type: "income", amount: 5500, category: "Project" },
];

// --- Pipeline Data ---
interface PipelineLead {
    id: number;
    company: string;
    contact: string;
    industry: string;
    stage: string;
    value: string;
}

const pipelineLeads: PipelineLead[] = [
    { id: 1, company: "MegaBuild Construction", contact: "Ahmad Razak", industry: "Construction", stage: "Proposal Sent", value: "RM 8,000" },
    { id: 2, company: "Vista Interiors", contact: "Sarah Lim", industry: "Interior Design", stage: "Meeting Booked", value: "RM 5,500" },
    { id: 3, company: "Apex Contractors", contact: "Hafiz Ismail", industry: "Construction", stage: "Follow Up", value: "RM 12,000" },
    { id: 4, company: "Luxe Living Studio", contact: "Amanda Tan", industry: "Interior Design", stage: "Hot Lead", value: "RM 6,000" },
    { id: 5, company: "Titan Build Sdn Bhd", contact: "Rizal Yusof", industry: "Construction", stage: "Cold Outreach", value: "RM 15,000" },
];

const stageColors: Record<string, string> = {
    "Hot Lead": "text-red-400 bg-red-400/10",
    "Meeting Booked": "text-blue-400 bg-blue-400/10",
    "Proposal Sent": "text-[var(--color-gold)] bg-[var(--color-gold-glow)]",
    "Follow Up": "text-yellow-400 bg-yellow-400/10",
    "Cold Outreach": "text-gray-400 bg-gray-400/10",
};

const industryIcons: Record<string, React.ElementType> = {
    Construction: Building2,
    "Interior Design": PaintBucket,
};

export default function WarRoomPage() {
    const [whatsappReplies, setWhatsappReplies] = useState(14);
    const [offerPresentations, setOfferPresentations] = useState(6);

    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Swords className="w-6 h-6 text-[var(--color-gold)]" />
                    The War Room
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Revenue targets, P&L tracking, and client pipeline — all in one command center.
                </p>
            </div>

            {/* ─── REVENUE GOAL ─── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Monthly Revenue Target</h2>
                    </div>
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Target: RM {revenueTarget.toLocaleString()}
                    </span>
                </div>

                {/* Big numbers */}
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold text-white">
                        RM {currentRevenue.toLocaleString()}
                    </span>
                    <span className="text-lg text-[var(--color-text-muted)] mb-1">
                        / RM {revenueTarget.toLocaleString()}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-4 bg-[var(--color-surface-hover)] rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-dim)] to-[var(--color-gold)] transition-all duration-1000 relative"
                        style={{ width: `${revenuePercentage}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
                    </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    {revenuePercentage}% achieved · RM{" "}
                    {(revenueTarget - currentRevenue).toLocaleString()} remaining
                </p>

                {/* Weekly chart */}
                <div className="mt-6 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyRevenue} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis
                                dataKey="week"
                                tick={{ fill: "#71717a", fontSize: 12 }}
                                axisLine={{ stroke: "#27272a" }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#71717a", fontSize: 12 }}
                                axisLine={{ stroke: "#27272a" }}
                                tickLine={false}
                                tickFormatter={(v) => `${v / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: "#141414",
                                    border: "1px solid #27272a",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "13px",
                                }}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, "Revenue"]}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                {weeklyRevenue.map((_, index) => (
                                    <Cell key={index} fill={index === weeklyRevenue.length - 1 ? "#c9a84c" : "#333"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ─── P&L Section ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick P&L Form */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <DollarSign className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Quick Entry</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                Description
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Website project payment"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                Amount (RM)
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">
                                Type
                            </label>
                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                                    <ArrowUp className="w-4 h-4 inline mr-1" />
                                    Income
                                </button>
                                <button className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors">
                                    <ArrowDown className="w-4 h-4 inline mr-1" />
                                    Expense
                                </button>
                            </div>
                        </div>
                        <button className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            <Plus className="w-4 h-4 inline mr-1" />
                            Add Transaction
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-muted)]">Total Income</span>
                            <span className="text-emerald-400 font-semibold">
                                + RM {totalIncome.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-muted)]">Total Expenses</span>
                            <span className="text-red-400 font-semibold">
                                – RM {totalExpenses.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-[var(--color-border-subtle)]">
                            <span className="text-white font-medium">Net Profit</span>
                            <span className="text-[var(--color-gold)] font-bold">
                                RM {(totalIncome - totalExpenses).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        <td className="px-6 py-3.5 text-sm text-[var(--color-text-muted)]">
                                            {t.date}
                                        </td>
                                        <td className="px-6 py-3.5 text-sm text-white">{t.description}</td>
                                        <td className="px-6 py-3.5">
                                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td
                                            className={`px-6 py-3.5 text-sm font-semibold text-right ${t.type === "income" ? "text-emerald-400" : "text-red-400"
                                                }`}
                                        >
                                            {t.type === "income" ? "+" : "–"} RM {t.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ─── CLIENT PIPELINE ─── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Client Pipeline</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Tally Counters */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-[var(--color-text-secondary)]">WA Replies</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setWhatsappReplies((p) => Math.max(0, p - 1))}
                                        className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        –
                                    </button>
                                    <span className="text-sm font-bold text-white w-8 text-center">
                                        {whatsappReplies}
                                    </span>
                                    <button
                                        onClick={() => setWhatsappReplies((p) => p + 1)}
                                        className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Presentation className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-[var(--color-text-secondary)]">Offers</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setOfferPresentations((p) => Math.max(0, p - 1))}
                                        className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        –
                                    </button>
                                    <span className="text-sm font-bold text-white w-8 text-center">
                                        {offerPresentations}
                                    </span>
                                    <button
                                        onClick={() => setOfferPresentations((p) => p + 1)}
                                        className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            + Add Lead
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {pipelineLeads.map((lead) => {
                        const IndustryIcon = industryIcons[lead.industry] || Tag;
                        return (
                            <div
                                key={lead.id}
                                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[var(--color-gold-glow)] flex items-center justify-center shrink-0">
                                    <IndustryIcon className="w-5 h-5 text-[var(--color-gold)]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{lead.company}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{lead.contact}</p>
                                </div>
                                <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${stageColors[lead.stage] || "text-gray-400 bg-gray-400/10"
                                        }`}
                                >
                                    {lead.stage}
                                </span>
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] shrink-0">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    {lead.industry}
                                </span>
                                <span className="text-sm font-bold text-white shrink-0">{lead.value}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
