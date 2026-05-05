"use client";

import { Module } from "@/types";
import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";

export default function CourseModuleAccordion({ module }: { module: Module }) {
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
