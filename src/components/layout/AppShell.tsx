"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

// Pages that should NOT show the sidebar/header and NOT require auth
const PUBLIC_ROUTES = ["/", "/login", "/auth/callback"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/auth/");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Close sidebar on resize to desktop
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Auth guard: redirect to login if not authenticated on protected routes
    useEffect(() => {
        if (!loading && !user && !isPublicRoute) {
            router.push("/login");
        }
    }, [loading, user, isPublicRoute, router]);

    // Public routes: render without sidebar/header
    if (isPublicRoute) {
        return <>{children}</>;
    }

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Not authenticated — don't render protected content
    if (!user) {
        return null;
    }

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                mobileOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:ml-[240px] min-h-screen flex flex-col transition-all duration-300">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
            </div>
        </>
    );
}
