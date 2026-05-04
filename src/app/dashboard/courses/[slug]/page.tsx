"use client";

import Button from "@/components/ui/Button";
import { useCourse, useCourseProgress, useUpdateProgress } from "@/hooks/useCourses";
import { Course, Lesson, LessonProgress, Module } from "@/types";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  FileText,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import ReactPlayer from "react-player";

export default function CoursePlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourse(slug);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const allLessons = course?.modules?.flatMap((module) => module.lessons) ?? [];
  const activeLesson =
    allLessons.find((lesson) => lesson.id === activeLessonId) ??
    allLessons[0] ??
    null;
  const activeCourseId = course?.id ?? "";

  const { data: progress } = useCourseProgress(activeCourseId);
  const { mutate: updateProgress } = useUpdateProgress();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <Link
            href="/dashboard/my-courses"
            className="text-xs text-indigo-600 hover:underline block mb-2"
          >
            &lt;- Mis cursos
          </Link>
          <h2 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {course.title}
          </h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                {completedCount}/{totalLessons} lecciones
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all"
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
              onSelectLesson={setActiveLessonId}
            />
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-50">
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
                  progressInterval={10000}
                  config={{
                    youtube: { playerVars: { showinfo: 1 } },
                  }}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 aspect-video w-full flex items-center justify-center">
                <FileText className="w-16 h-16 text-white opacity-50" />
              </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    {
                      course.modules?.find((module) =>
                        module.lessons.some((lesson) => lesson.id === activeLesson.id)
                      )?.title
                    }
                  </p>
                  <h1 className="text-2xl font-bold text-gray-900">
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
                  className="flex-shrink-0"
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
                onNavigate={(lesson) => setActiveLessonId(lesson.id)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Selecciona una lección para comenzar</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ModuleSidebarItem({
  module,
  activeLesson,
  getLessonProgress,
  onSelectLesson,
}: {
  module: Module;
  activeLesson: Lesson | null;
  getLessonProgress: (id: string) => LessonProgress | undefined;
  onSelectLesson: (lessonId: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const completedInModule = module.lessons.filter(
    (lesson) => getLessonProgress(lesson.id)?.completed
  ).length;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {module.title}
          </p>
          <p className="text-xs text-gray-400">
            {completedInModule}/{module.lessons.length}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div>
          {module.lessons.map((lesson) => {
            const lessonProgress = getLessonProgress(lesson.id);
            const isActive = activeLesson?.id === lesson.id;

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-indigo-50 border-r-2 border-indigo-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {lessonProgress?.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs truncate ${
                      isActive ? "text-indigo-700 font-medium" : "text-gray-700"
                    }`}
                  >
                    {lesson.title}
                  </p>
                  {lesson.durationSecs > 0 && (
                    <p className="text-xs text-gray-400">
                      {Math.floor(lesson.durationSecs / 60)}m
                    </p>
                  )}
                </div>
                {lesson.type === "VIDEO" ? (
                  <Play className="w-3 h-3 text-gray-300 flex-shrink-0" />
                ) : (
                  <FileText className="w-3 h-3 text-gray-300 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LessonNavigation({
  course,
  activeLesson,
  onNavigate,
}: {
  course: Course;
  activeLesson: Lesson;
  onNavigate: (lesson: Lesson) => void;
}) {
  const allLessons = course.modules?.flatMap((module) => module.lessons) ?? [];
  const currentIndex = allLessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {prev ? (
        <Button variant="secondary" size="sm" onClick={() => onNavigate(prev)}>
          &lt;- {prev.title}
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button size="sm" onClick={() => onNavigate(next)}>
          {next.title} -&gt;
        </Button>
      ) : (
        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Fin del curso
        </div>
      )}
    </div>
  );
}
