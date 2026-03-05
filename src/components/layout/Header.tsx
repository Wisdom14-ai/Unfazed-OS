"use client";

import { Bell, Search, User, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 md:px-6">
            {/* Left side */}
            <div className="flex items-center gap-3 flex-1">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                    <Menu className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>

                {/* Search */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile search icon */}
                <button className="sm:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                    <Search className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
                    <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-gold)] rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-[var(--color-border)]">
                    <div className="text-right hidden md:block">
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
