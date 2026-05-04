import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ApiResponse, AuthResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

function getApiErrorMessage(
  error: AxiosError<ApiResponse<unknown>>,
  fallback: string
) {
  return error.response?.data?.message || fallback;
}

export function useAuth() {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const clearSessionQueries = () => {
    queryClient.removeQueries({ queryKey: ["enrollments"] });
    queryClient.removeQueries({ queryKey: ["progress"] });
  };

  const loginMutation = useMutation<
    AuthResponse,
    AxiosError<ApiResponse<unknown>>,
    LoginData
  >({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      clearSessionQueries();
      login(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        {
          email: data.email,
          fullName: data.fullName,
          role: data.role,
        }
      );
      toast.success(`Bienvenido, ${data.fullName}`);
      router.push("/dashboard/my-courses");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Credenciales incorrectas"));
    },
  });

  const registrationMutation = useMutation<
    AuthResponse,
    AxiosError<ApiResponse<unknown>>,
    RegisterData
  >({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      clearSessionQueries();
      login(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        {
          email: data.email,
          fullName: data.fullName,
          role: data.role,
        }
      );

      toast.success("Cuenta creada exitosamente");
      router.push("/dashboard/my-courses");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Error al registrarse"));
    },
  });

  const handleLogout = () => {
    clearSessionQueries();
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
