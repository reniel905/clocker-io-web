"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "otp">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, verifyOtp } = useAuth();
  const router = useRouter();

  const inputClass =
    "peer w-full border border-outline-variant bg-surface text-on-surface m3-shape-sm px-4 pt-5 pb-2 text-sm outline-2 outline-transparent transition-all placeholder-transparent focus:outline-primary";
  const labelClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant transition-all pointer-events-none peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs";

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const msg = await register({
        email,
        password,
        name: { firstName, middleName: middleName || undefined, lastName },
      });
      setMessage(msg);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyOtp(email, otp);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="w-full max-w-sm m3-shape-xl bg-surface text-on-surface m3-elevation-2 p-8">
        <h1 className="m3-headline-medium text-center text-primary mb-1">
          Verify your email
        </h1>
        {message && (
          <p className="mb-4 m3-body-small text-on-tertiary-container bg-tertiary-container m3-shape-sm px-4 py-3">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
            {error}
          </p>
        )}
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="relative">
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className={`${inputClass} text-center text-lg tracking-[0.5em]`}
              placeholder="OTP Code"
            />
            <label htmlFor="otp" className={labelClass}>
              OTP Code
            </label>
          </div>
          <Button
            type="submit"
            variant="filled"
            disabled={submitting || otp.length !== 6}
            className="w-full"
          >
            {submitting ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm m3-shape-xl bg-surface text-on-surface m3-elevation-2 p-8">
      <h1 className="m3-headline-medium text-center text-primary mb-1">
        Create an account
      </h1>
      <p className="m3-body-medium text-center text-on-surface-variant mb-8">
        Register for Clocker-io
      </p>

      {error && (
        <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {(["First", "Middle", "Last"] as const).map((label) => {
            const id = label.toLowerCase();
            const val =
              id === "first"
                ? firstName
                : id === "middle"
                  ? middleName
                  : lastName;
            const setter =
              id === "first"
                ? setFirstName
                : id === "middle"
                  ? setMiddleName
                  : setLastName;
            return (
              <div key={id} className="relative">
                <input
                  id={`name-${id}`}
                  type="text"
                  required={id !== "middle"}
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  className={inputClass}
                  placeholder={label}
                />
                <label htmlFor={`name-${id}`} className={labelClass}>
                  {label}
                </label>
              </div>
            );
          })}
        </div>

        <div className="relative">
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Email"
          />
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Password"
          />
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
        </div>

        <div className="relative">
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="Confirm Password"
          />
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </label>
        </div>

        <Button type="submit" variant="filled" disabled={submitting} className="w-full">
          {submitting ? "Registering..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center m3-body-small text-on-surface-variant">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
