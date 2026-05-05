import { Course } from "@/types";
import { BookOpen, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }: { course: Course }) {
  const totalLessons =
    course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) ?? 0;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-md transition-all group"
    >
      <div className="h-44 bg-gradient-to-br from-brand-500 to-brand-accent-600 relative">
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
        <h3 className="font-semibold text-content group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-2 mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-content-muted mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-content-soft">
            <Users className="w-3.5 h-3.5" />
            <span>{course.instructorName}</span>
          </div>
          <span className="font-bold text-brand-600">
            {course.price === 0
              ? "Gratis"
              : `$${course.price} ${course.currency}`}
          </span>
        </div>

        {totalLessons > 0 && (
          <p className="text-xs text-content-soft mt-2">
            {course.modules?.length} módulos · {totalLessons} lecciones
          </p>
        )}
      </div>
    </Link>
  );
}
