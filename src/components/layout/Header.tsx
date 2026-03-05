"use client";

import { Bell, Search, User } from "lucide-react";

export default function Header() {
    return (
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                    <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-gold)] rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Commander</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Unfazed Pro</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dim)] flex items-center justify-center">
                        <User className="w-4 h-4 text-black" />
                    </div>
                </div>
            </div>
        </header>
    );
}
