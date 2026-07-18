"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const features = [
  {
    title: "Clock In / Out",
    desc: "One-click clock-in and clock-out with automatic time tracking. Track your work hours in real time.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Dashboard Analytics",
    desc: "View your daily and weekly work hours at a glance. See your active sessions and total time tracked.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Time Records",
    desc: "Browse, search, and manage all your clock-in records in a clean table view. Filter by date and status.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "DTR Reports",
    desc: "Generate printable Daily Time Record documents for any month. Export as PDF or print directly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Calendar View",
    desc: "Visualize your time entries on a calendar. Switch between day, week, and month views.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Secure Authentication",
    desc: "Login with email and password or Google Sign-In. Your data is protected with encrypted sessions.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "1",
    title: "Create an Account",
    desc: "Sign up with your email or Google account. It takes less than a minute.",
  },
  {
    num: "2",
    title: "Clock In",
    desc: "Press the clock-in button when you start your work day. The timer runs automatically.",
  },
  {
    num: "3",
    title: "Track Your Time",
    desc: "View your records, check your dashboard stats, and manage your schedule.",
  },
  {
    num: "4",
    title: "Generate Reports",
    desc: "Create DTR reports for any month and download them as PDF when needed.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  function handleSignIn() {
    const hasSession = typeof window !== "undefined" && localStorage.getItem("clockerUserId");
    router.push(hasSession ? "/dashboard" : "/login");
  }

  function openPrivacy() {
    window.dispatchEvent(new CustomEvent("open-privacy-policy"));
  }

  return (
    <div className="flex min-h-svh flex-col bg-surface-container-low">
      {/* ───── Navbar ───── */}
      <header className="sticky top-0 z-30 bg-surface-container-low text-on-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <span className="m3-title-large text-primary">Clocker-io</span>

          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#features"
              className="m3-shape-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="m3-shape-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              How It Works
            </a>
            <a
              href="#contact"
              className="m3-shape-full px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="m3-shape-full p-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "light" ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>
            <button onClick={handleSignIn}>
              <Button variant="text" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </button>
            <Link href="/register">
              <Button variant="filled">Get Started</Button>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden m3-shape-full p-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-outline-variant/40 px-4 py-3 space-y-1 bg-surface-container-low">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="flex m3-shape-full px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="flex m3-shape-full px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              How It Works
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="flex m3-shape-full px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              Contact
            </a>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleSignIn();
              }}
              className="flex m3-shape-full px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors w-full text-left"
            >
              Sign In
            </button>
          </nav>
        )}
      </header>

      {/* ───── Hero ───── */}
      <section className="flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center">
        <h1 className="m3-display-large text-on-surface max-w-3xl">
          Track Your Work Hours,{" "}
          <span className="text-primary">Effortlessly</span>
        </h1>
        <p className="mt-4 m3-body-large text-on-surface-variant max-w-xl">
          Clocker-io is a simple employee time tracker that lets you clock in
          and out, view your records, generate DTR reports, and stay on top of
          your work schedule.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/register">
            <Button variant="filled" className="!h-12 !px-8 !m3-label-large">
              Get Started Free
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outlined"
              className="!h-12 !px-8 !m3-label-large"
            >
              Learn More
            </Button>
          </a>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section
        id="features"
        className="px-4 py-16 md:py-24 bg-surface-container-low"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="m3-headline-medium text-on-surface text-center">
            Everything You Need
          </h2>
          <p className="mt-2 m3-body-medium text-on-surface-variant text-center max-w-lg mx-auto">
            Simple tools for tracking, managing, and reporting your work hours.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Card key={f.title} variant="filled" className="!p-5">
                <div className="flex h-10 w-10 items-center justify-center m3-shape-sm bg-primary-container text-primary">
                  {f.icon}
                </div>
                <h3 className="mt-4 m3-title-small text-on-surface">
                  {f.title}
                </h3>
                <p className="mt-1 m3-body-medium text-on-surface-variant">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section id="how-it-works" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="m3-headline-medium text-on-surface text-center">
            How It Works
          </h2>
          <p className="mt-2 m3-body-medium text-on-surface-variant text-center">
            Get started in four simple steps.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center m3-shape-full bg-primary text-on-primary m3-title-large font-bold">
                  {s.num}
                </div>
                <h3 className="mt-4 m3-title-small text-on-surface">
                  {s.title}
                </h3>
                <p className="mt-1 m3-body-medium text-on-surface-variant">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Contact ───── */}
      <section
        id="contact"
        className="px-4 py-16 md:py-24 bg-surface-container-low"
      >
        <div className="mx-auto max-w-lg text-center">
          <h2 className="m3-headline-medium text-on-surface">Contact</h2>
          <p className="mt-2 m3-body-medium text-on-surface-variant">
            Built with care by the developer. Reach out with questions or
            feedback.
          </p>

          <Card variant="elevated" className="mt-8 !p-6 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center m3-shape-full bg-primary text-on-primary m3-title-large font-bold">
                RB
              </div>
              <div>
                <p className="m3-title-medium text-on-surface">
                  Reniel Baldove
                </p>
                <p className="m3-body-small text-on-surface-variant">
                  Developer
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3 border-t border-outline-variant/40 pt-5">
              <a
                href="mailto:baldove.reniel905@gmail.com"
                className="flex items-center gap-3 m3-body-medium text-primary hover:underline"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                baldove.reniel905@gmail.com
              </a>
              <a
                href="https://github.com/reniel905"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 m3-body-medium text-primary hover:underline"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                github.com/reniel905
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-outline-variant/40 bg-surface-container-low px-4 py-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="m3-body-small text-on-surface-variant">
            &copy; {new Date().getFullYear()} Clocker-io. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={openPrivacy}
              className="m3-body-small text-primary hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-cookie-settings"))
              }
              className="m3-body-small text-primary hover:underline"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
