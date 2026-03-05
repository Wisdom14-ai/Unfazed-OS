"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Handle the OAuth callback
        // Supabase client automatically detects the auth code/hash in the URL
        // and exchanges it for a session
        const handleCallback = async () => {
            const { searchParams } = new URL(window.location.href);
            const code = searchParams.get("code");

            if (code) {
                // Exchange the code for a session — this stores tokens in localStorage
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    console.error("Auth callback error:", error);
                    router.push("/login?error=callback_failed");
                    return;
                }
            }

            // Redirect to dashboard after successful auth
            router.push("/dashboard");
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--color-text-muted)]">
                    Signing you in...
                </p>
            </div>
        </div>
    );
}
