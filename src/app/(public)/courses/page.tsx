"use client";

import { usePublishedCourses } from "@/hooks/useCourses";
import { Course } from "@/types";
import { BookOpen, Search, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CoursesPage() {
  const { data: courses, isLoading } = usePublishedCourses();
  const [search, setSearch] = useState("");

  const filtered = courses?.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de cursos
          </h1>
          <p className="text-gray-500 mb-6">
            Aprende con los mejores instructores
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : !filtered?.length ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron cursos</p>
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

function CourseCard({ course }: { course: Course }) {
  const totalLessons =
    course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) ?? 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
    >
      <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white opacity-50" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>{course.instructorName}</span>
          </div>
          <span className="font-bold text-indigo-600">
            {course.price === 0
              ? "Gratis"
              : `$${course.price} ${course.currency}`}
          </span>
        </div>

        {totalLessons > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {course.modules?.length} módulos · {totalLessons} lecciones
          </p>
        )}
      </div>
    </Link>
  );
}
