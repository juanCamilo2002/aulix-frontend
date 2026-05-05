import Button from "@/components/ui/Button";
import { Course, Lesson } from "@/types";
import { CheckCircle } from "lucide-react";

export default function LessonNavigation({
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
