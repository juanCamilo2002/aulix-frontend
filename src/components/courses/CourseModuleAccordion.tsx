"use client";

import { Module } from "@/types";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";

export default function CourseModuleAccordion({ module }: { module: Module }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-surface hover:bg-surface-hover transition-colors text-left"
      >
        <div>
          <span className="font-medium text-content">{module.title}</span>
          <span className="text-sm text-content-soft ml-2">
            {module.lessons.length} lecciones
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-content-soft" />
        ) : (
          <ChevronDown className="w-4 h-4 text-content-soft" />
        )}
      </button>

      {open && (
        <div className="border-t border-border-muted">
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-border-muted last:border-0 bg-surface-muted"
            >
              <Play className="w-4 h-4 text-content-soft flex-shrink-0" />
              <span className="text-sm text-content-muted flex-1">{lesson.title}</span>
              {lesson.durationSecs > 0 && (
                <span className="text-xs text-content-soft">
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
