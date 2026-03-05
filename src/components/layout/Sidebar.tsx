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
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forge", label: "The Forge", icon: Flame },
  { href: "/warroom", label: "War Room", icon: Swords },
  { href: "/alchemy", label: "Alchemy", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300
        ${collapsed ? "lg:w-[68px]" : "lg:w-[240px]"}
        ${mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-black" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Unfazed<span className="text-[var(--color-gold)]"> OS</span>
            </span>
          )}
        </div>
        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
        >
          <X className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                ? "bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                : "text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-hover)]"
                }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 transition-colors ${isActive
                  ? "text-[var(--color-gold)]"
                  : "text-[var(--color-text-muted)] group-hover:text-white"
                  }`}
              />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info + Sign Out */}
      {user && (
        <div className={`px-2 pb-2 ${collapsed ? "px-1" : ""}`}>
          <div className={`flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] ${collapsed ? "justify-center px-1" : ""}`}>
            {user.user_metadata?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] flex items-center justify-center shrink-0 text-black text-xs font-bold">
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
            )}
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">
                  {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse Toggle + Sign Out */}
      <div className="px-2 pb-4 flex gap-2">
        <button
          onClick={handleSignOut}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center px-3 py-2 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-surface-hover)] transition-all text-sm"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
