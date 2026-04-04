import { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/api';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ErrorResponse;
    if (data.fieldErrors) {
      const firstField = Object.keys(data.fieldErrors)[0];
      return data.fieldErrors[firstField];
    }
    if (data.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
