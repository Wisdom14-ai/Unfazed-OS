"use client";

import { useEffect, useState, useCallback } from "react";
import { Sparkles, BookOpen, PenLine, Clock, Quote, Lightbulb, Brain, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import type { Tables } from "@/lib/database.types";

type JournalEntry = Tables<"journal_entries">;
type BookNote = Tables<"book_notes">;

function getTodayStr() {
    return new Date().toISOString().split("T")[0];
}

const journalPrompts = [
    "What emotion dominated my day and why?",
    "What am I resisting right now?",
    "What would the best version of me do today?",
    "What did I learn about myself this week?",
];

const colorOptions = [
    { label: "Green", value: "from-emerald-500/20 to-emerald-500/5" },
    { label: "Blue", value: "from-blue-500/20 to-blue-500/5" },
    { label: "Purple", value: "from-purple-500/20 to-purple-500/5" },
    { label: "Orange", value: "from-orange-500/20 to-orange-500/5" },
    { label: "Cyan", value: "from-cyan-500/20 to-cyan-500/5" },
    { label: "Gold", value: "from-[var(--color-gold)]/20 to-[var(--color-gold)]/5" },
];

export default function AlchemyPage() {
    const { showToast } = useToast();
    const [journalText, setJournalText] = useState("");
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [bookNotes, setBookNotes] = useState<BookNote[]>([]);
    const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
    const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Book note modal
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteForm, setNoteForm] = useState({ title: "", author: "", model: "", insight: "", color: colorOptions[0].value });

    const today = getTodayStr();

    const loadData = useCallback(async () => {
        setLoading(true);
        const [notesRes, todayRes, pastRes] = await Promise.all([
            supabase.from("book_notes").select("*").order("created_at", { ascending: false }),
            supabase.from("journal_entries").select("*").eq("date", today).single(),
            supabase.from("journal_entries").select("*").neq("date", today).order("date", { ascending: false }).limit(7),
        ]);
        setBookNotes(notesRes.data || []);
        if (todayRes.data) {
            setTodayEntry(todayRes.data);
            setJournalText(todayRes.data.content);
            setSelectedPrompt(todayRes.data.prompt_used);
        }
        setPastEntries(pastRes.data || []);
        setLoading(false);
    }, [today]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const saveJournal = async () => {
        setSaving(true);
        const wordCount = journalText.split(/\s+/).filter(Boolean).length;
        const payload = {
            date: today,
            content: journalText,
            prompt_used: selectedPrompt || "",
            word_count: wordCount,
        };

        const { data, error } = await supabase
            .from("journal_entries")
            .upsert(payload, { onConflict: "date" })
            .select()
            .single();

        if (!error && data) {
            setTodayEntry(data);
            showToast("Journal entry saved ✍️", "success");
        } else {
            showToast("Failed to save entry", "error");
        }
        setSaving(false);
    };

    const addBookNote = async () => {
        if (!noteForm.title) {
            showToast("Book title is required", "error");
            return;
        }
        const { data, error } = await supabase
            .from("book_notes")
            .insert({
                title: noteForm.title,
                author: noteForm.author,
                model: noteForm.model,
                insight: noteForm.insight,
                color: noteForm.color,
            })
            .select()
            .single();
        if (!error && data) {
            setBookNotes((prev) => [data, ...prev]);
            setShowNoteModal(false);
            setNoteForm({ title: "", author: "", model: "", insight: "", color: colorOptions[0].value });
            showToast("Book note added! 📚", "success");
        }
    };

    const deleteBookNote = async (id: string) => {
        await supabase.from("book_notes").delete().eq("id", id);
        setBookNotes((prev) => prev.filter((n) => n.id !== id));
        showToast("Note deleted", "info");
    };

    const todayFormatted = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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
                    <Sparkles className="w-6 h-6 text-[var(--color-gold)]" />
                    Alchemy
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Transform thoughts into clarity. Journal daily and collect mental models that sharpen your mind.
                </p>
            </div>

            {/* ─── JOURNAL SECTION ─── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PenLine className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Emotional Consciousness</h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{todayFormatted}</span>
                        {todayEntry && <span className="text-emerald-400 ml-2">● Saved</span>}
                    </div>
                </div>

                <div className="px-6 pt-5 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Prompts to guide you</p>
                    <div className="flex flex-wrap gap-2">
                        {journalPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedPrompt(prompt);
                                    if (!journalText) setJournalText(prompt + "\n\n");
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedPrompt === prompt
                                        ? "bg-[var(--color-gold)] text-black"
                                        : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-gold-dim)] hover:text-white"
                                    }`}
                            >
                                <Quote className="w-3 h-3 inline mr-1" />
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                    <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Start writing... Let your thoughts flow freely. This is your space for radical honesty and emotional clarity."
                        className="w-full h-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-5 py-4 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {journalText.length} characters · {journalText.split(/\s+/).filter(Boolean).length} words
                        </span>
                        <button
                            onClick={saveJournal}
                            disabled={saving || !journalText.trim()}
                            className="px-5 py-2 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : "Save Entry"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── PAST ENTRIES ─── */}
            {pastEntries.length > 0 && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Past Entries</h2>
                    <div className="space-y-3">
                        {pastEntries.map((entry) => (
                            <details key={entry.id} className="group">
                                <summary className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] cursor-pointer hover:border-[var(--color-border)] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <PenLine className="w-4 h-4 text-[var(--color-gold)]" />
                                        <span className="text-sm text-white">{entry.date}</span>
                                        {entry.prompt_used && (
                                            <span className="text-xs text-[var(--color-text-muted)]">· {entry.prompt_used.substring(0, 40)}...</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-[var(--color-text-muted)]">{entry.word_count} words</span>
                                </summary>
                                <div className="px-4 py-3 mt-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
                                    <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}

            {/* ─── BOOK NOTES ─── */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Book Notes &amp; Mental Models</h2>
                    </div>
                    <button onClick={() => setShowNoteModal(true)} className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                        + Add Note
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookNotes.map((note) => (
                        <div key={note.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-card-hover)] transition-all duration-200 group relative">
                            <div className={`h-1.5 bg-gradient-to-r ${note.color}`} />
                            <button
                                onClick={() => deleteBookNote(note.id)}
                                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-white">{note.title}</h3>
                                        <p className="text-xs text-[var(--color-text-muted)]">{note.author}</p>
                                    </div>
                                    <Brain className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] transition-colors" />
                                </div>
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Lightbulb className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                                    <span className="text-xs font-semibold text-[var(--color-gold)]">{note.model}</span>
                                </div>
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">{note.insight}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Note Modal */}
            <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} title="Add Book Note">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Book Title</label>
                        <input type="text" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="e.g. Atomic Habits" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Author</label>
                        <input type="text" value={noteForm.author} onChange={(e) => setNoteForm({ ...noteForm, author: e.target.value })} placeholder="e.g. James Clear" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Mental Model / Key Concept</label>
                        <input type="text" value={noteForm.model} onChange={(e) => setNoteForm({ ...noteForm, model: e.target.value })} placeholder="e.g. 1% Better Every Day" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Key Insight</label>
                        <textarea value={noteForm.insight} onChange={(e) => setNoteForm({ ...noteForm, insight: e.target.value })} placeholder="What's the most important takeaway?" className="w-full h-24 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wider">Color</label>
                        <div className="flex gap-2">
                            {colorOptions.map((c) => (
                                <button key={c.label} onClick={() => setNoteForm({ ...noteForm, color: c.value })} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.value} border-2 transition-all ${noteForm.color === c.value ? "border-[var(--color-gold)] scale-110" : "border-transparent"}`} title={c.label} />
                            ))}
                        </div>
                    </div>
                    <button onClick={addBookNote} className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                        <Plus className="w-4 h-4 inline mr-1" /> Add Note
                    </button>
                </div>
            </Modal>
        </div>
    );
}
