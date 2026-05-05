"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            <span className="text-xl font-bold text-brand-600">Aulix</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/courses" className="text-sm text-content-muted hover:text-brand-600">
              Cursos
            </Link>
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard/my-courses">
                <Button size="sm">Mi dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="secondary" size="sm">Iniciar sesión</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
