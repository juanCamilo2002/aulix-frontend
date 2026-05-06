"use client";

import Button from "@/components/ui/Button";
import LessonNavigation from "@/components/courses/LessonNavigation";
import MobileCourseLessonList from "@/components/courses/MobileCourseLessonList";
import ModuleSidebarItem from "@/components/courses/ModuleSidebarItem";
import { useCourseContent, useCourseProgress, useUpdateProgress } from "@/hooks/useCourses";
import { Lesson, LessonProgress } from "@/types";
import {
  BookOpen,
  CheckCircle,
  FileText,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="bg-black aspect-video w-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function CoursePlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourseContent(slug);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const allLessons = course?.modules?.flatMap((module) => module.lessons) ?? [];
  const activeLesson =
    allLessons.find((lesson) => lesson.id === activeLessonId) ??
    allLessons[0] ??
    null;
  const activeCourseId = course?.id ?? "";

  const { data: progress } = useCourseProgress(activeCourseId);
  const { mutate: updateProgress, flushPendingProgress } = useUpdateProgress();

  const getLessonProgress = (lessonId: string): LessonProgress | undefined =>
    progress?.find((item) => item.lessonId === lessonId);

  const completedCount = progress?.filter((item) => item.completed).length ?? 0;
  const totalLessons = allLessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handleLessonComplete = (lesson: Lesson) => {
    if (!activeCourseId) return;
    const current = getLessonProgress(lesson.id);
    updateProgress({
      courseId: activeCourseId,
      lessonId: lesson.id,
      completed: !current?.completed,
      lastPosition: current?.lastPosition ?? 0,
    });
    void flushPendingProgress();
  };

  const handleVideoProgress = (state: { playedSeconds: number }) => {
    if (!activeLesson || !activeCourseId) return;
    updateProgress({
      courseId: activeCourseId,
      lessonId: activeLesson.id,
      completed: getLessonProgress(activeLesson.id)?.completed ?? false,
      lastPosition: Math.floor(state.playedSeconds),
    });
  };

  const handleVideoEnded = () => {
    if (!activeLesson || !activeCourseId) return;
    updateProgress({
      courseId: activeCourseId,
      lessonId: activeLesson.id,
      completed: true,
      lastPosition: activeLesson.durationSecs,
    });
    void flushPendingProgress();
  };

  const handleSelectLesson = (lessonId: string) => {
    if (lessonId === activeLesson?.id) return;
    void flushPendingProgress();
    setActiveLessonId(lessonId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <aside className="w-80 flex-shrink-0 bg-surface border-r border-border overflow-y-auto hidden lg:block">
        <div className="p-4 border-b border-border sticky top-0 bg-surface z-10">
          <Link
            href="/dashboard/my-courses"
            className="text-xs text-brand-600 hover:underline block mb-2"
          >
            &lt;- Mis cursos
          </Link>
          <h2 className="font-semibold text-content text-sm line-clamp-2">
            {course.title}
          </h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-content-muted mb-1">
              <span>
                {completedCount}/{totalLessons} lecciones
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-surface-muted rounded-full h-1.5">
              <div
                className="bg-brand-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="py-2">
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
      </aside>

      <main className="flex-1 overflow-y-auto bg-app">
        <MobileCourseLessonList
          course={course}
          activeLesson={activeLesson}
          completedCount={completedCount}
          totalLessons={totalLessons}
          progressPercent={progressPercent}
          getLessonProgress={getLessonProgress}
          onSelectLesson={handleSelectLesson}
        />

        {activeLesson ? (
          <div>
            {activeLesson.type === "VIDEO" && activeLesson.videoUrl ? (
              <div className="bg-black aspect-video w-full">
                <ReactPlayer
                  url={activeLesson.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  onProgress={handleVideoProgress}
                  onEnded={handleVideoEnded}
                  progressInterval={10000}
                  config={{
                    youtube: { playerVars: { showinfo: 1 } },
                  }}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-brand-900 to-brand-accent-900 aspect-video w-full flex items-center justify-center">
                <FileText className="w-16 h-16 text-white opacity-50" />
              </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-brand-600 font-medium mb-1">
                    {
                      course.modules?.find((module) =>
                        module.lessons.some((lesson) => lesson.id === activeLesson.id)
                      )?.title
                    }
                  </p>
                  <h1 className="text-2xl font-bold text-content">
                    {activeLesson.title}
                  </h1>
                </div>
                <Button
                  variant={
                    getLessonProgress(activeLesson.id)?.completed
                      ? "secondary"
                      : "primary"
                  }
                  size="sm"
                  onClick={() => handleLessonComplete(activeLesson)}
                  className="w-full sm:w-auto flex-shrink-0"
                >
                  {getLessonProgress(activeLesson.id)?.completed ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Completada
                    </span>
                  ) : (
                    "Marcar como completada"
                  )}
                </Button>
              </div>

              <LessonNavigation
                course={course}
                activeLesson={activeLesson}
                onNavigate={(lesson) => handleSelectLesson(lesson.id)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-content-subtle mx-auto mb-4" />
              <p className="text-content-muted">Selecciona una lección para comenzar</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
