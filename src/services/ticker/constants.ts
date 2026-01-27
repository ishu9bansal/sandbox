export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const DEFAULT_TIMEOUT = process.env.NEXT_PUBLIC_DEFAULT_TIMEOUT
  ? parseInt(process.env.NEXT_PUBLIC_DEFAULT_TIMEOUT, 10)
  : 10000; // default to 10 seconds if not set