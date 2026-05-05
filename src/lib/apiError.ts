import { ApiAxiosError, ApiValidationErrors } from "@/types";

export function getApiErrorMessage(
  error: ApiAxiosError,
  fallback: string
): string {
  return error.response?.data?.message || fallback;
}

export function getApiValidationErrors(
  error: ApiAxiosError<ApiValidationErrors>
): ApiValidationErrors | null {
  return error.response?.data?.data ?? null;
}
