"use client";

import { useActionState, useEffect } from "react";
import Background from "../../components/Background";
import Link from "next/link";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { login, LoginState } from "@/actions/auth";
import { useRouter } from "next/navigation";

const initialState: LoginState = {
  error: "",
  fieldErrors: {},
};

export default function AdminLogin() {
  const [state, action, isPending] = useActionState(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.token) {
      localStorage.setItem("admin_token", state.token);
      router.push("/admin/dashboard");
    }
  }, [state.success, state.token, router]);

  return (
    <div className="bg-background-dark text-white font-display min-h-screen relative overflow-hidden">
      <Background />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Glass Panel */}
          <div className="glass-panel rounded-3xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">
                  admin_panel_settings
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-white/50 text-sm">
                Sign in to manage your portfolio
              </p>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {state.error}
              </div>
            )}

            {/* Login Form */}
            <form action={action} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  icon="mail"
                  placeholder="admin@example.com"
                // required // Zod handles validation
                />
                {state?.fieldErrors?.email && (
                  <p className="text-xs text-red-400 mt-1">{state.fieldErrors.email[0]}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  icon="lock"
                  placeholder="••••••••"
                // required // Zod handles validation
                />
                {state?.fieldErrors?.password && (
                  <p className="text-xs text-red-400 mt-1">{state.fieldErrors.password[0]}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" isLoading={isPending} icon="arrow_forward">
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10"></div>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Back to Portfolio */}
            <Link href="/" className="block">
              <Button variant="glass">
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>
                <span>Back to Portfolio</span>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-white/30 text-sm mt-6">
            © 2026 Portfolio Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
