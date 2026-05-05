"use client";

import { Lesson, LessonProgress, Module } from "@/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  FileText,
  Play,
} from "lucide-react";
import { useState } from "react";

export default function ModuleSidebarItem({
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
                    ? "bg-brand-50 border-r-2 border-brand-600"
                    : "hover:bg-gray-50"
                }`}
              >
                {lessonProgress?.completed ? (
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs truncate ${
                      isActive ? "text-brand-700 font-medium" : "text-gray-700"
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
