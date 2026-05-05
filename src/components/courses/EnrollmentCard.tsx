import { Enrollment } from "@/types";
import { BookOpen, Clock, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  return (
    <Link
      href={`/dashboard/courses/${enrollment.courseSlug}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-accent-600 relative">
        {enrollment.courseThumbnail ? (
          <Image
            src={enrollment.courseThumbnail}
            alt={enrollment.courseTitle}
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
        {enrollment.status === "COMPLETED" && (
          <div className="absolute top-3 right-3 bg-success-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Completado
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-3">
          {enrollment.courseTitle}
        </h3>

        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              {enrollment.completedLessons} de {enrollment.totalLessons} lecciones
            </span>
            <span>{enrollment.progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all"
              style={{ width: `${enrollment.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(enrollment.enrolledAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
