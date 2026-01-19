"use client";

import { useState } from "react";
import Background from "../../components/Background";
import Link from "next/link";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    // TODO: Implement actual authentication logic
    setTimeout(() => {
      setIsLoading(false);
      // Placeholder - will be replaced with real auth
      setError("Authentication not yet implemented");
    }, 1000);
  };

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
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  icon="mail"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary/80 hover:text-primary transition-colors mb-2"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  icon="lock"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" isLoading={isLoading} icon="arrow_forward">
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/30 text-sm uppercase tracking-widest text-[10px] font-bold">
                or
              </span>
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
