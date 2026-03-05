"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

// Pages that should NOT show the sidebar/header (landing, auth, etc.)
const PUBLIC_ROUTES = ["/"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
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

    if (isPublicRoute) {
        return <>{children}</>;
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
