"use client";

import { useEffect, useState, useCallback } from "react";
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
    Trash2,
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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert } from "@/lib/database.types";

type Transaction = Tables<"transactions">;
type Lead = Tables<"leads">;

function getTodayStr() {
    return new Date().toISOString().split("T")[0];
}

const stageColors: Record<string, string> = {
    "Hot Lead": "text-red-400 bg-red-400/10",
    "Meeting Booked": "text-blue-400 bg-blue-400/10",
    "Proposal Sent": "text-[var(--color-gold)] bg-[var(--color-gold-glow)]",
    "Follow Up": "text-yellow-400 bg-yellow-400/10",
    "Cold Outreach": "text-gray-400 bg-gray-400/10",
    "Closed Won": "text-emerald-400 bg-emerald-400/10",
};

const industryIcons: Record<string, React.ElementType> = {
    Construction: Building2,
    "Interior Design": PaintBucket,
};

export default function WarRoomPage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [revenueTarget] = useState(60000);

    // Form states
    const [txDesc, setTxDesc] = useState("");
    const [txAmount, setTxAmount] = useState("");
    const [txType, setTxType] = useState<"income" | "expense">("income");
    const [txCategory, setTxCategory] = useState("Project");

    // Lead modal
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [leadForm, setLeadForm] = useState({ company: "", contact: "", industry: "Construction", stage: "Cold Outreach", value: "" });

    // Tally counters
    const [whatsappReplies, setWhatsappReplies] = useState(0);
    const [offerPresentations, setOfferPresentations] = useState(0);

    const loadData = useCallback(async () => {
        setLoading(true);
        if (!user) {
            setTransactions([]);
            setLeads([]);
            setLoading(false);
            return;
        }

        const startOfMonth = getTodayStr().substring(0, 7) + "-01";
        const [txRes, leadsRes] = await Promise.all([
            supabase.from("transactions").select("*").filter("user_id", "eq", user.id).gte("date", startOfMonth).order("date", { ascending: false }),
            supabase.from("leads").select("*").filter("user_id", "eq", user.id).order("created_at", { ascending: false }),
        ]);
        setTransactions(txRes.data || []);
        setLeads(leadsRes.data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const currentRevenue = totalIncome;
    const revenuePercentage = Math.round((currentRevenue / revenueTarget) * 100);

    // Weekly revenue for chart
    const getWeeklyRevenue = () => {
        const weeks: { week: string; amount: number }[] = [];
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        for (let w = 0; w < 4; w++) {
            const start = new Date(year, month, w * 7 + 1);
            const end = new Date(year, month, Math.min((w + 1) * 7, new Date(year, month + 1, 0).getDate()));
            const startStr = start.toISOString().split("T")[0];
            const endStr = end.toISOString().split("T")[0];
            const weekIncome = transactions
                .filter((t) => t.type === "income" && t.date >= startStr && t.date <= endStr)
                .reduce((sum, t) => sum + t.amount, 0);
            weeks.push({ week: `W${w + 1}`, amount: weekIncome });
        }
        return weeks;
    };

    const weeklyRevenue = getWeeklyRevenue();

    // Add transaction
    const addTransaction = async () => {
        if (!user) return;
        if (!txDesc || !txAmount) {
            showToast("Fill in description and amount", "error");
            return;
        }
        const insertPayload: TablesInsert<"transactions"> & { user_id: string } = {
            date: getTodayStr(),
            description: txDesc,
            type: txType,
            amount: parseFloat(txAmount),
            category: txCategory,
            user_id: user.id,
        };
        const { data, error } = await supabase
            .from("transactions")
            .insert(insertPayload)
            .select()
            .single();
        if (!error && data) {
            setTransactions((prev) => [data, ...prev]);
            setTxDesc("");
            setTxAmount("");
            showToast(`${txType === "income" ? "Income" : "Expense"} added!`, "success");
        }
    };

    const deleteTransaction = async (id: string) => {
        if (!user) return;
        await supabase.from("transactions").delete().eq("id", id).filter("user_id", "eq", user.id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showToast("Transaction deleted", "info");
    };

    // Add lead
    const addLead = async () => {
        if (!user) return;
        if (!leadForm.company) {
            showToast("Company name is required", "error");
            return;
        }
        const insertPayload: TablesInsert<"leads"> & { user_id: string } = {
            company: leadForm.company,
            contact: leadForm.contact,
            industry: leadForm.industry,
            stage: leadForm.stage,
            value: parseFloat(leadForm.value) || 0,
            user_id: user.id,
        };
        const { data, error } = await supabase
            .from("leads")
            .insert(insertPayload)
            .select()
            .single();
        if (!error && data) {
            setLeads((prev) => [data, ...prev]);
            setShowLeadModal(false);
            setLeadForm({ company: "", contact: "", industry: "Construction", stage: "Cold Outreach", value: "" });
            showToast("Lead added to pipeline!", "success");
        }
    };

    const deleteLead = async (id: string) => {
        if (!user) return;
        await supabase.from("leads").delete().eq("id", id).filter("user_id", "eq", user.id);
        setLeads((prev) => prev.filter((l) => l.id !== id));
        showToast("Lead removed", "info");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
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
                    <span className="text-sm text-[var(--color-text-muted)]">Target: RM {revenueTarget.toLocaleString()}</span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-bold text-white">RM {currentRevenue.toLocaleString()}</span>
                    <span className="text-lg text-[var(--color-text-muted)] mb-1">/ RM {revenueTarget.toLocaleString()}</span>
                </div>
                <div className="w-full h-4 bg-[var(--color-surface-hover)] rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-gold-dim)] to-[var(--color-gold)] transition-all duration-1000 relative"
                        style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-full" />
                    </div>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    {revenuePercentage}% achieved · RM {(revenueTarget - currentRevenue).toLocaleString()} remaining
                </p>
                <div className="mt-6 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyRevenue} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                            <XAxis dataKey="week" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#27272a" }} tickLine={false} />
                            <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={{ stroke: "#27272a" }} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                            <Tooltip
                                contentStyle={{ background: "#141414", border: "1px solid #27272a", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
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
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Description</label>
                            <input type="text" value={txDesc} onChange={(e) => setTxDesc(e.target.value)} placeholder="e.g. Website project payment" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Amount (RM)</label>
                            <input type="number" value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="0.00" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Category</label>
                            <select value={txCategory} onChange={(e) => setTxCategory(e.target.value)} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                <option>Project</option>
                                <option>Retainer</option>
                                <option>Marketing</option>
                                <option>Tools</option>
                                <option>Infrastructure</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Type</label>
                            <div className="flex gap-2">
                                <button onClick={() => setTxType("income")} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${txType === "income" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"}`}>
                                    <ArrowUp className="w-4 h-4 inline mr-1" /> Income
                                </button>
                                <button onClick={() => setTxType("expense")} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${txType === "expense" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"}`}>
                                    <ArrowDown className="w-4 h-4 inline mr-1" /> Expense
                                </button>
                            </div>
                        </div>
                        <button onClick={addTransaction} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            <Plus className="w-4 h-4 inline mr-1" /> Add Transaction
                        </button>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-muted)]">Total Income</span>
                            <span className="text-emerald-400 font-semibold">+ RM {totalIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-muted)]">Total Expenses</span>
                            <span className="text-red-400 font-semibold">– RM {totalExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-[var(--color-border-subtle)]">
                            <span className="text-white font-medium">Net Profit</span>
                            <span className="text-[var(--color-gold)] font-bold">RM {(totalIncome - totalExpenses).toLocaleString()}</span>
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
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Description</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Category</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                                    <th className="px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-[var(--color-text-muted)]">No transactions yet. Add your first entry!</td></tr>
                                ) : (
                                    transactions.map((t) => (
                                        <tr key={t.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-hover)] transition-colors">
                                            <td className="px-6 py-3.5 text-sm text-[var(--color-text-muted)]">{t.date}</td>
                                            <td className="px-6 py-3.5 text-sm text-white">{t.description}</td>
                                            <td className="px-6 py-3.5">
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-[var(--color-text-secondary)]">{t.category}</span>
                                            </td>
                                            <td className={`px-6 py-3.5 text-sm font-semibold text-right ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                                                {t.type === "income" ? "+" : "–"} RM {t.amount.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <button onClick={() => deleteTransaction(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-[var(--color-text-secondary)]">WA Replies</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setWhatsappReplies((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors">–</button>
                                    <span className="text-sm font-bold text-white w-8 text-center">{whatsappReplies}</span>
                                    <button onClick={() => setWhatsappReplies((p) => p + 1)} className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors">+</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Presentation className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-[var(--color-text-secondary)]">Offers</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setOfferPresentations((p) => Math.max(0, p - 1))} className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors">–</button>
                                    <span className="text-sm font-bold text-white w-8 text-center">{offerPresentations}</span>
                                    <button onClick={() => setOfferPresentations((p) => p + 1)} className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-xs hover:bg-[var(--color-surface-hover)] transition-colors">+</button>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowLeadModal(true)} className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            + Add Lead
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {leads.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No leads in your pipeline. Start prospecting!</p>
                    ) : (
                        leads.map((lead) => {
                            const IndustryIcon = industryIcons[lead.industry] || Tag;
                            return (
                                <div key={lead.id} className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-gold-glow)] flex items-center justify-center shrink-0">
                                        <IndustryIcon className="w-5 h-5 text-[var(--color-gold)]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{lead.company}</p>
                                        <p className="text-xs text-[var(--color-text-muted)]">{lead.contact}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${stageColors[lead.stage] || "text-gray-400 bg-gray-400/10"}`}>{lead.stage}</span>
                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] shrink-0">
                                        <Tag className="w-3 h-3 inline mr-1" />{lead.industry}
                                    </span>
                                    <span className="text-sm font-bold text-white shrink-0">RM {lead.value.toLocaleString()}</span>
                                    <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Add Lead Modal */}
            <Modal isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} title="Add New Lead">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Company</label>
                        <input type="text" value={leadForm.company} onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })} placeholder="e.g. MegaBuild Construction" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Contact Person</label>
                        <input type="text" value={leadForm.contact} onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })} placeholder="e.g. Ahmad Razak" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Industry</label>
                            <select value={leadForm.industry} onChange={(e) => setLeadForm({ ...leadForm, industry: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                <option>Construction</option>
                                <option>Interior Design</option>
                                <option>Technology</option>
                                <option>F&B</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Stage</label>
                            <select value={leadForm.stage} onChange={(e) => setLeadForm({ ...leadForm, stage: e.target.value })} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--color-gold)] transition-colors appearance-none">
                                <option>Cold Outreach</option>
                                <option>Follow Up</option>
                                <option>Meeting Booked</option>
                                <option>Proposal Sent</option>
                                <option>Hot Lead</option>
                                <option>Closed Won</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Value (RM)</label>
                        <input type="number" value={leadForm.value} onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })} placeholder="e.g. 8000" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <button onClick={addLead} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                        <Plus className="w-4 h-4 inline mr-1" /> Add to Pipeline
                    </button>
                </div>
            </Modal>
        </div>
    );
}
