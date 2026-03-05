"use client";

import { useState } from "react";
import { Sparkles, BookOpen, PenLine, Clock, Quote, Lightbulb, Brain } from "lucide-react";

// --- Book Notes ---
interface BookNote {
    id: number;
    title: string;
    author: string;
    model: string;
    insight: string;
    color: string;
}

const bookNotes: BookNote[] = [
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        model: "1% Better Every Day",
        insight:
            "You do not rise to the level of your goals. You fall to the level of your systems. Every action is a vote for the type of person you wish to become.",
        color: "from-emerald-500/20 to-emerald-500/5",
    },
    {
        id: 2,
        title: "Deep Work",
        author: "Cal Newport",
        model: "Attention Residue",
        insight:
            "When you switch from Task A to Task B, your attention doesn't immediately follow — a residue of your attention remains stuck on the original task. This residue destroys deep work.",
        color: "from-blue-500/20 to-blue-500/5",
    },
    {
        id: 3,
        title: "The Almanack of Naval",
        author: "Eric Jorgenson",
        model: "Specific Knowledge",
        insight:
            "Specific knowledge is knowledge you cannot be trained for. If society can train you, it can train someone else and replace you. It's found by pursuing your genuine curiosity.",
        color: "from-purple-500/20 to-purple-500/5",
    },
    {
        id: 4,
        title: "Ego Is The Enemy",
        author: "Ryan Holiday",
        model: "The Canvas Strategy",
        insight:
            "Find canvases for other people to paint on. Clear the path for the people above you and you will eventually create a path for yourself. Reduce your ego, increase your results.",
        color: "from-orange-500/20 to-orange-500/5",
    },
    {
        id: 5,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        model: "System 1 vs System 2",
        insight:
            "System 1 operates automatically with little effort. System 2 allocates attention to mental activities that demand it. Most of our errors come from trusting System 1 when System 2 is needed.",
        color: "from-cyan-500/20 to-cyan-500/5",
    },
    {
        id: 6,
        title: "Meditations",
        author: "Marcus Aurelius",
        model: "Amor Fati",
        insight:
            "You have power over your mind — not outside events. Realize this, and you will find strength. Accept what happens — not resignedly, but with love for the process.",
        color: "from-[var(--color-gold)]/20 to-[var(--color-gold)]/5",
    },
];

const journalPrompts = [
    "What emotion dominated my day and why?",
    "What am I resisting right now?",
    "What would the best version of me do today?",
    "What did I learn about myself this week?",
];

export default function AlchemyPage() {
    const [journalText, setJournalText] = useState("");
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Page Header */}
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
                        <span>February 25, 2026</span>
                    </div>
                </div>

                {/* Prompts */}
                <div className="px-6 pt-5 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                        Prompts to guide you
                    </p>
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

                {/* Text area */}
                <div className="px-6 pb-6 pt-2">
                    <textarea
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        placeholder="Start writing... Let your thoughts flow freely. This is your space for radical honesty and emotional clarity."
                        className="w-full h-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-5 py-4 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {journalText.length} characters · {journalText.split(/\s+/).filter(Boolean).length}{" "}
                            words
                        </span>
                        <button className="px-5 py-2 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                            Save Entry
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── BOOK NOTES ─── */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[var(--color-gold)]" />
                        <h2 className="text-lg font-semibold text-white">Book Notes &amp; Mental Models</h2>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg bg-[var(--color-gold)] text-black text-sm font-semibold hover:bg-[var(--color-gold-dim)] transition-colors">
                        + Add Note
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookNotes.map((note) => (
                        <div
                            key={note.id}
                            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-card-hover)] transition-all duration-200 group"
                        >
                            <div className={`h-1.5 bg-gradient-to-r ${note.color}`} />
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
                                    <span className="text-xs font-semibold text-[var(--color-gold)]">
                                        {note.model}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-4">
                                    {note.insight}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
