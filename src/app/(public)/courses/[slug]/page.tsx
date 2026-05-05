"use client";

import CourseModuleAccordion from "@/components/courses/CourseModuleAccordion";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useCourse, useEnroll, useMyEnrollments } from "@/hooks/useCourses";
import { BookOpen, Clock, Play, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <p className="text-content-muted">Curso no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <div className="bg-gradient-to-br from-brand-900 to-brand-accent-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <Link
              href="/courses"
              className="text-brand-300 text-sm hover:text-white mb-4 inline-block"
            >
              &lt;- Volver al catálogo
            </Link>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-brand-200 mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-200">
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
            <h2 className="text-xl font-bold text-content mb-4">
              Contenido del curso
            </h2>
            <div className="space-y-3">
              {course.modules?.map((module) => (
                <CourseModuleAccordion key={module.id} module={module} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface rounded-2xl border border-border p-6 sticky top-24">
              <div className="text-3xl font-bold text-content mb-1">
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

              <ul className="mt-6 space-y-2 text-sm text-content-muted">
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  {course.modules?.length} módulos
                </li>
                <li className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-brand-500" />
                  {totalLessons} lecciones
                </li>
                {totalDuration > 0 && (
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-500" />
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
