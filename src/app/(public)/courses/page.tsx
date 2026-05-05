"use client";

import CourseCard from "@/components/courses/CourseCard";
import { usePublishedCourses } from "@/hooks/useCourses";
import { BookOpen, Search, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function CoursesPage() {
  const { data: courses, isLoading, isError } = usePublishedCourses();
  const [search, setSearch] = useState("");

  const filtered = courses?.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app">
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-content mb-2">
            Catálogo de cursos
          </h1>
          <p className="text-content-muted mb-6">
            Aprende con los mejores instructores
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-soft" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border bg-surface rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
            <p className="text-content font-medium mb-2">Error al cargar cursos</p>
            <p className="text-content-muted text-sm">Intenta de nuevo más tarde</p>
          </div>
        ) : !filtered?.length ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-content-subtle mx-auto mb-4" />
            <p className="text-content-muted">No se encontraron cursos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
