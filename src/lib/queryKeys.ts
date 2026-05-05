export const courseKeys = {
  all: ["courses"] as const,
  list: () => ["courses"] as const,
  detail: (slug: string) => ["courses", slug] as const,
};

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  myCourses: () => ["enrollments"] as const,
  progressAll: () => ["progress"] as const,
  progress: (courseId: string) => ["progress", courseId] as const,
};
