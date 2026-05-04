import api from "@/lib/api";
import { ApiResponse, Course, Enrollment, LessonProgress } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function usePublishedCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Course[]>>("/courses");
      return res.data.data;
    }
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["courses", slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Course>>(`/courses/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
  });
}

export function useMyEnrollments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Enrollment[]>>(
        "/enrollments/my-courses"
      );

      return res.data.data;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await api.post<ApiResponse<Enrollment>>(
        `/enrollments/courses/${courseId}`
      );

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("¡Matriculado exitosamente!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Error al matricularse");
    },
  });
}

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: ["progress", courseId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<LessonProgress[]>>(
        `/enrollments/courses/${courseId}/progress`
      );
      return res.data.data;
    },
    enabled: !!courseId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
      completed,
      lastPosition,
    }: {
      courseId: string;
      lessonId: string;
      completed: boolean;
      lastPosition: number;
    }) => {
      const res = await api.put(
        `/enrollments/courses/${courseId}/lessons/${lessonId}/progress`,
        { completed, lastPosition }
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["progress", variables.courseId]
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    }
  });
}
