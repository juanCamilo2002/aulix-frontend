"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { BookOpen, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard/my-courses" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-600">Aulix</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard/my-courses"
              className="text-sm text-content-muted hover:text-brand-600 transition-colors"
            >
              Mis cursos
            </Link>
            <Link
              href="/courses"
              className="text-sm text-content-muted hover:text-brand-600 transition-colors"
            >
              Catálogo
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* User menu */}
            <div className="relative">
<button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-content-muted">
                {user?.fullName}
              </span>
            </button>

{menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border py-1 z-50"
                role="menu"
              >
                <div className="px-4 py-2 border-b border-border-muted">
                  <p className="text-sm font-medium text-content">{user?.fullName}</p>
                  <p className="text-xs text-content-muted">{user?.email}</p>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
