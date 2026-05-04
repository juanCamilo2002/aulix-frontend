"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCourse, useEnroll, useMyEnrollments } from "@/hooks/useCourses";
import { Module } from "@/types";
import { BookOpen, ChevronDown, ChevronUp, Clock, Play, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { data: course, isLoading } = useCourse(slug);
  const { data: enrollments } = useMyEnrollments({ enabled: isAuthenticated });
  const { mutate: enroll, isPending } = useEnroll();
  const router = useRouter();

  const isEnrolled =
    isAuthenticated && enrollments?.some((enrollment) => enrollment.courseSlug === slug);

  const totalLessons =
    course?.modules?.reduce((acc, module) => acc + module.lessons.length, 0) ?? 0;

  const totalDuration =
    course?.modules?.reduce(
      (acc, module) =>
        acc + module.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.durationSecs, 0),
      0
    ) ?? 0;

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} minutos`;
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (course) {
      enroll(course.id, {
        onSuccess: () => router.push(`/dashboard/courses/${slug}`),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <Link
              href="/courses"
              className="text-indigo-300 text-sm hover:text-white mb-4 inline-block"
            >
              &lt;- Volver al catálogo
            </Link>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-indigo-200 mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-200">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.instructorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} lecciones</span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contenido del curso
            </h2>
            <div className="space-y-3">
              {course.modules?.map((module) => (
                <ModuleAccordion key={module.id} module={module} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {course.price === 0
                  ? "Gratis"
                  : `$${course.price} ${course.currency}`}
              </div>

              {isEnrolled ? (
                <Link href={`/dashboard/courses/${slug}`}>
                  <Button className="w-full mt-4" size="lg">
                    Ir al curso -&gt;
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleEnroll}
                  loading={isPending}
                >
                  {course.price === 0 ? "Matricularme gratis" : "Comprar curso"}
                </Button>
              )}

              <ul className="mt-6 space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  {course.modules?.length} módulos
                </li>
                <li className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-500" />
                  {totalLessons} lecciones
                </li>
                {totalDuration > 0 && (
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    {formatDuration(totalDuration)} de contenido
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleAccordion({ module }: { module: Module }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <span className="font-medium text-gray-900">{module.title}</span>
          <span className="text-sm text-gray-400 ml-2">
            {module.lessons.length} lecciones
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 bg-gray-50"
            >
              <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
              {lesson.durationSecs > 0 && (
                <span className="text-xs text-gray-400">
                  {Math.floor(lesson.durationSecs / 60)}m
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
