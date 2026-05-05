import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { unwrapApiData } from "@/lib/apiResponse";
import { courseKeys, enrollmentKeys } from "@/lib/queryKeys";
import {
  ApiAxiosError,
  ApiResponse,
  Course,
  Enrollment,
  LessonProgress,
  UpdateLessonProgressRequest,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePublishedCourses() {
  return useQuery<Course[], ApiAxiosError>({
    queryKey: courseKeys.list(),
    queryFn: async () => {
      const res = await api.get<ApiResponse<Course[]>>("/courses");
      return unwrapApiData(res.data);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourse(slug: string) {
  return useQuery<Course, ApiAxiosError>({
    queryKey: courseKeys.detail(slug),
    queryFn: async () => {
      const res = await api.get<ApiResponse<Course>>(`/courses/${slug}`);
      return unwrapApiData(res.data);
    },
    enabled: !!slug,
  });
}

export function useMyEnrollments(options?: { enabled?: boolean }) {
  return useQuery<Enrollment[], ApiAxiosError>({
    queryKey: enrollmentKeys.myCourses(),
    queryFn: async () => {
      const res = await api.get<ApiResponse<Enrollment[]>>(
        "/enrollments/my-courses"
      );

      return unwrapApiData(res.data);
    },
    enabled: options?.enabled ?? true,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation<Enrollment, ApiAxiosError, string>({
    mutationFn: async (courseId: string) => {
      const res = await api.post<ApiResponse<Enrollment>>(
        `/enrollments/courses/${courseId}`
      );

      return unwrapApiData(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.myCourses() });
      toast.success("¡Matriculado exitosamente!");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error al matricularse"));
    },
  });
}

export function useCourseProgress(courseId: string) {
  return useQuery<LessonProgress[], ApiAxiosError>({
    queryKey: enrollmentKeys.progress(courseId),
    queryFn: async () => {
      const res = await api.get<ApiResponse<LessonProgress[]>>(
        `/enrollments/courses/${courseId}/progress`
      );
      return unwrapApiData(res.data);
    },
    enabled: !!courseId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation<
    LessonProgress | undefined,
    ApiAxiosError,
    UpdateLessonProgressRequest
  >({
    mutationFn: async ({
      courseId,
      lessonId,
      completed,
      lastPosition,
    }) => {
      const res = await api.put<ApiResponse<LessonProgress>>(
        `/enrollments/courses/${courseId}/lessons/${lessonId}/progress`,
        { completed, lastPosition }
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.progress(variables.courseId)
      });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.myCourses() });
    }
  });
}
