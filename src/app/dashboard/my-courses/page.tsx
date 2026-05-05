"use client";

import EnrollmentCard from "@/components/courses/EnrollmentCard";
import { useMyEnrollments } from "@/hooks/useCourses";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function MyCoursesPage() {
  const { data: enrollments, isLoading } = useMyEnrollments();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!enrollments?.length) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-16 h-16 text-content-subtle mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-content-muted mb-2">
          No tienes cursos aún
        </h2>
        <p className="text-content-muted mb-6">
          Explora el catálogo y comienza a aprender hoy
        </p>
        <Link
          href="/courses"
          className="bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-content">Mis cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </div>
  );
}
