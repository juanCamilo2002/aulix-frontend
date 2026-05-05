import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { unwrapApiData } from "@/lib/apiResponse";
import { enrollmentKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/store/authStore";
import {
  ApiAxiosError,
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearSessionQueries = () => {
    queryClient.removeQueries({ queryKey: enrollmentKeys.myCourses() });
    queryClient.removeQueries({ queryKey: enrollmentKeys.progressAll() });
  };

  const loginMutation = useMutation<
    AuthResponse,
    ApiAxiosError,
    LoginRequest
  >({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
      return unwrapApiData(res.data);
    },
    onSuccess: (data) => {
      clearSessionQueries();
      login({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });
      toast.success(`Bienvenido, ${data.fullName}`);
      router.push("/dashboard/my-courses");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Credenciales incorrectas"));
    },
  });

  const registrationMutation = useMutation<
    AuthResponse,
    ApiAxiosError,
    RegisterRequest
  >({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
      return unwrapApiData(res.data);
    },
    onSuccess: (data) => {
      clearSessionQueries();
      login({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      });

      toast.success("Cuenta creada exitosamente");
      router.push("/dashboard/my-courses");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error al registrarse"));
    },
  });

  const handleLogout = async () => {
    clearSessionQueries();
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local state even if the server session already expired.
    }
    logout();
    router.push("/login");
    toast.success("Sesión cerrada");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registrationMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registrationMutation.isPending,
  };
}
