import { ApiResponse } from "@/types";

export function unwrapApiData<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === undefined) {
    throw new Error(response.message || "Respuesta inválida del servidor");
  }

  return response.data;
}
