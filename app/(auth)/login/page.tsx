"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm m3-shape-xl bg-surface text-on-surface m3-elevation-2 p-8">
      <h1 className="m3-headline-medium text-center text-primary mb-1">
        Clocker-io
      </h1>
      <p className="m3-body-medium text-center text-on-surface-variant mb-8">
        Sign in to your account
      </p>

      {error && (
        <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
            placeholder="Email"
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Email
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary"
            placeholder="Password"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Password
          </label>
        </div>

        <Button type="submit" variant="filled" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-2 text-xs text-on-surface-variant">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleLoginButton />

      <p className="mt-6 text-center m3-body-small text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
