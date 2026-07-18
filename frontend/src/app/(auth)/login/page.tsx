"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setTokens, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      const { data } = await authApi.login(form);
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-orion-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,170,0.08)_0%,transparent_60%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orion-teal/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orion-violet/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orion-teal/20 to-orion-violet/20 border border-orion-teal/30 mb-4"
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-orion-teal rounded-full animate-pulse-glow" />
              <div className="absolute inset-1 border border-orion-violet rounded-full" />
              <div className="absolute inset-3 bg-orion-teal rounded-full" />
            </div>
          </motion.div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            ORION X
          </h1>
          <p className="text-text-secondary mt-2">
            Intelligent Enterprise OS
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <h2 className="text-heading-sm font-semibold text-text-primary mb-1">
            Welcome back
          </h2>
          <p className="text-text-secondary text-body-sm mb-6">
            Sign in to your ORION X workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-body-sm text-orion-coral bg-orion-coral/10 px-3 py-2 rounded-md"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-center text-body-sm text-text-tertiary">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-orion-teal hover:text-orion-teal/80 transition-colors font-medium"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* SSO Options */}
          <div className="mt-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-body-sm">
                <span className="px-2 bg-surface-card text-text-tertiary">
                  or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="md"
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                }
              >
                Google
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#00A4EF" d="M21 12v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h8v2H5v14h14v-7h2z" />
                    <path fill="#00A4EF" d="M18 2v4h4" />
                    <path fill="#00A4EF" d="M11 13L21 3l2 2-10 10z" />
                  </svg>
                }
              >
                Microsoft
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-body-sm text-text-tertiary mt-6">
          Protected by enterprise-grade security
        </p>
      </motion.div>
    </div>
  );
}
