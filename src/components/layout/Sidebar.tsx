"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  Swords,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forge", label: "The Forge", icon: Flame },
  { href: "/warroom", label: "War Room", icon: Swords },
  { href: "/alchemy", label: "Alchemy", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-black" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Unfazed<span className="text-[var(--color-gold)]"> OS</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                  : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-text-muted)] group-hover:text-white"
                }`}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-all text-sm"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
