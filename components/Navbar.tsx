"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/records", label: "Records" },
  { href: "/calendar", label: "Calendar" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const initials = user
    ? `${user.name.firstName[0]}${user.name.lastName[0]}`.toUpperCase()
    : "";

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface-container-low text-on-surface m3-elevation-1">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden m3-shape-full p-2.5 text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href="/dashboard"
              className="m3-title-large text-primary"
            >
              Clocker-io
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`m3-shape-full px-4 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-secondary-container text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {link.label}
              </Link>
            ))}
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

            {user && (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex h-8 w-8 items-center justify-center m3-shape-full bg-primary text-on-primary text-xs font-bold"
                  title={`${user.name.firstName} ${user.name.lastName}`}
                >
                  {initials}
                </Link>
                <Button variant="text" onClick={handleLogout} className="hidden sm:inline-flex text-sm !px-3">
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-surface text-on-surface shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-outline-variant/40">
            <span className="m3-title-large text-primary">Clocker-io</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="m3-shape-full p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors"
              aria-label="Close navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 m3-shape-full px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {user && (
            <div className="border-t border-outline-variant/40 px-4 py-4 space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 items-center justify-center m3-shape-full bg-primary text-on-primary text-xs font-bold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {user.name.firstName} {user.name.lastName}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={toggle}
                className="flex items-center gap-3 w-full m3-shape-full px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
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
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
              <Button variant="text" onClick={handleLogout} className="w-full justify-start !px-4">
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
