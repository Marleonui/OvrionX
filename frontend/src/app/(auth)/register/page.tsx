"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setTokens, setLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setLoading(true);

    try {
      const { data } = await authApi.register(form);
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error?.response?.data?.message || "Registration failed. Please try again."
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orion-teal/20 to-orion-violet/20 border border-orion-teal/30 mb-4">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-orion-teal rounded-full animate-pulse-glow" />
              <div className="absolute inset-1 border border-orion-violet rounded-full" />
              <div className="absolute inset-3 bg-orion-teal rounded-full" />
            </div>
          </div>
          <h1 className="text-heading-lg font-display font-bold text-text-primary">
            Create Account
          </h1>
          <p className="text-text-secondary mt-2">
            Join ORION X — Intelligent Enterprise OS
          </p>
        </div>

        {/* Register Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Max Mustermann"
              leftIcon={<User className="w-4 h-4" />}
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              required
            />
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
                placeholder="Min. 8 characters"
                leftIcon={<Lock className="w-4 h-4" />}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
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

            {/* Password requirements */}
            <div className="space-y-1.5">
              {[
                form.password.length >= 8,
                /[A-Z]/.test(form.password),
                /[0-9]/.test(form.password),
              ].map((condition, i) => (
                <div key={i} className="flex items-center gap-2 text-body-sm">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      condition
                        ? "bg-orion-teal/20 text-orion-teal"
                        : "bg-surface-elevated text-text-tertiary"
                    }`}
                  >
                    <Check
                      className={`w-3 h-3 ${condition ? "" : "opacity-30"}`}
                    />
                  </div>
                  <span
                    className={
                      condition ? "text-text-secondary" : "text-text-tertiary"
                    }
                  >
                    {[
                      "At least 8 characters",
                      "One uppercase letter",
                      "One number",
                    ][i]}
                  </span>
                </div>
              ))}
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
              rightIcon={
                !isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined
              }
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-subtle">
            <p className="text-center text-body-sm text-text-tertiary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-orion-teal hover:text-orion-teal/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-body-sm text-text-tertiary mt-6">
          By creating an account, you agree to our Terms of Service
        </p>
      </motion.div>
    </div>
  );
}
