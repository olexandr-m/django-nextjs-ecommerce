import { ApiResponse } from "@/types";

export function extractErrorMessage(error: unknown): string {
  const DEFAULT_MESSAGE = "An unexpected error occurred";
  const serverResponse = (error as { data?: ApiResponse<any> })?.data;

  if (!serverResponse) return DEFAULT_MESSAGE;

  if (serverResponse.errors) {
    const firstErrorArray = Object.values(serverResponse.errors)[0];
    return Array.isArray(firstErrorArray) ? firstErrorArray[0] : (firstErrorArray ?? serverResponse.message);
  }

  return serverResponse.message || DEFAULT_MESSAGE;
}
