"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/dashboard/my-courses" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-indigo-600">Aulix</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard/my-courses"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Mis cursos
            </Link>
            <Link
              href="/courses"
              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Catálogo
            </Link>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.fullName}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
