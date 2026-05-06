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
import { useCallback, useEffect, useRef } from "react";
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

export function useCourseContent(slug: string) {
  return useQuery<Course, ApiAxiosError>({
    queryKey: [...courseKeys.detail(slug), "content"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Course>>(`/courses/${slug}/content`);
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

  const pendingProgress = useRef<Map<string, UpdateLessonProgressRequest>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushPendingProgressRef = useRef<
    ((options?: { keepalive?: boolean }) => Promise<void>) | null
  >(null);
  const isFlushing = useRef(false);

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  }, []);

  const updateProgressCache = useCallback((progress: UpdateLessonProgressRequest) => {
    const key = enrollmentKeys.progress(progress.courseId);
    queryClient.setQueryData<LessonProgress[]>(key, (old) => {
      const next = {
        lessonId: progress.lessonId,
        completed: progress.completed,
        lastPosition: progress.lastPosition,
      };

      if (!old) return [next];
      if (!old.some((item) => item.lessonId === progress.lessonId)) {
        return [...old, next];
      }

      return old.map((item) =>
        item.lessonId === progress.lessonId ? { ...item, ...next } : item
      );
    });
  }, [queryClient]);

  const sendProgress = useCallback(async (progress: UpdateLessonProgressRequest) => {
    await api.put<ApiResponse<LessonProgress>>(
      `/enrollments/courses/${progress.courseId}/lessons/${progress.lessonId}/progress`,
      { completed: progress.completed, lastPosition: progress.lastPosition }
    );
  }, []);

  const sendProgressWithKeepalive = useCallback((progress: UpdateLessonProgressRequest) => {
    if (typeof navigator === "undefined" || typeof document === "undefined") {
      return false;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const csrfToken = getCookie("csrfToken");
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;

    fetch(
      `${api.defaults.baseURL}/enrollments/courses/${progress.courseId}/lessons/${progress.lessonId}/progress`,
      {
        method: "PUT",
        credentials: "include",
        keepalive: true,
        headers,
        body: JSON.stringify({
          completed: progress.completed,
          lastPosition: progress.lastPosition,
        }),
      }
    ).catch(() => undefined);

    return true;
  }, []);

  const scheduleFlush = useCallback(() => {
    clearDebounceTimer();
    debounceTimer.current = setTimeout(() => {
      void flushPendingProgressRef.current?.();
    }, 30000);
  }, [clearDebounceTimer]);

  const flushPendingProgress = useCallback(async (options?: { keepalive?: boolean }) => {
    if (pendingProgress.current.size === 0) return;

    clearDebounceTimer();
    const batch = Array.from(pendingProgress.current.entries());

    if (options?.keepalive) {
      batch.forEach(([, progress]) => sendProgressWithKeepalive(progress));
      pendingProgress.current.clear();
      return;
    }

    if (isFlushing.current) return;

    isFlushing.current = true;

    try {
      for (const [key, progress] of batch) {
        try {
          await sendProgress(progress);

          const latest = pendingProgress.current.get(key);
          if (latest === progress) {
            pendingProgress.current.delete(key);
          }
        } catch {
          queryClient.invalidateQueries({ queryKey: enrollmentKeys.progress(progress.courseId) });
        }
      }
    } finally {
      isFlushing.current = false;
    }

    if (pendingProgress.current.size > 0) {
      scheduleFlush();
    }
  }, [clearDebounceTimer, queryClient, scheduleFlush, sendProgress, sendProgressWithKeepalive]);

  useEffect(() => {
    flushPendingProgressRef.current = flushPendingProgress;
  }, [flushPendingProgress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void flushPendingProgress();
      }
    };
    const handlePageHide = () => {
      void flushPendingProgress({ keepalive: true });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      void flushPendingProgress();
      clearDebounceTimer();
    };
  }, [clearDebounceTimer, flushPendingProgress]);

  const mutate = useCallback((progress: UpdateLessonProgressRequest) => {
    const key = `${progress.courseId}-${progress.lessonId}`;
    const existing = pendingProgress.current.get(key);

    if (
      existing &&
      existing.completed === progress.completed &&
      Math.abs(existing.lastPosition - progress.lastPosition) < 5
    ) {
      return;
    }

    pendingProgress.current.set(key, progress);
    updateProgressCache(progress);
    scheduleFlush();
  }, [scheduleFlush, updateProgressCache]);

  return {
    mutate,
    flushPendingProgress,
  };
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
}
