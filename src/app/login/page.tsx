"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold)] flex items-center justify-center mb-4 shadow-lg shadow-[var(--color-gold)]/20">
                        <Zap className="w-7 h-7 text-black" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Unfazed<span className="text-[var(--color-gold)]"> OS</span>
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
                        Your personal operating system
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">
                    <h2 className="text-xl font-semibold text-white text-center mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] text-center mb-8">
                        Sign in to access your command center
                    </p>

                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-gold-dim)] transition-all duration-200 group cursor-pointer"
                    >
                        {/* Google Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="text-sm font-medium text-white group-hover:text-[var(--color-gold)] transition-colors">
                            Continue with Google
                        </span>
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[var(--color-text-muted)]">
                            By signing in, you agree to our Terms of Service
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
                    >
                        ← Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}
