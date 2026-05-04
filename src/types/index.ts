export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "SUPERADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: User["role"];
  tenantSlug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  published: boolean;
  instructorName: string;
  modules: Module[];
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ";
  videoUrl?: string;
  durationSecs: number;
  sortOrder: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseThumbnail?: string;
  status: "ACTIVE" | "COMPLETED" | "REFUNDED";
  amountPaid: number;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  enrolledAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  lastPosition: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}
