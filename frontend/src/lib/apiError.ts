import axios from 'axios';

export function extractApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message[0] : (message ?? fallback);
  }
  return 'Network error';
}
