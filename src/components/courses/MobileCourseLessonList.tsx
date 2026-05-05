"use client";

import ModuleSidebarItem from "@/components/courses/ModuleSidebarItem";
import { Course, Lesson, LessonProgress } from "@/types";
import { ChevronDown, ChevronUp, ListVideo } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileCourseLessonList({
  course,
  activeLesson,
  completedCount,
  totalLessons,
  progressPercent,
  getLessonProgress,
  onSelectLesson,
}: {
  course: Course;
  activeLesson: Lesson | null;
  completedCount: number;
  totalLessons: number;
  progressPercent: number;
  getLessonProgress: (id: string) => LessonProgress | undefined;
  onSelectLesson: (lessonId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleSelectLesson = (lessonId: string) => {
    onSelectLesson(lessonId);
    setOpen(false);
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 py-3">
        <Link
          href="/dashboard/my-courses"
          className="text-xs text-brand-600 hover:underline block mb-2"
        >
          &lt;- Mis cursos
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900 text-sm line-clamp-2">
              {course.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {activeLesson?.title ?? "Selecciona una lección"}
            </p>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex-shrink-0"
            aria-expanded={open}
          >
            <ListVideo className="w-4 h-4" />
            Lecciones
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              {completedCount}/{totalLessons} lecciones
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-brand-600 h-1.5 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {open && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-gray-100 pb-2">
          {course.modules?.map((module) => (
            <ModuleSidebarItem
              key={module.id}
              module={module}
              activeLesson={activeLesson}
              getLessonProgress={getLessonProgress}
              onSelectLesson={handleSelectLesson}
            />
          ))}
        </div>
      )}
    </div>
  );
}
