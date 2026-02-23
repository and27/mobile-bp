import { AppError } from "./AppError";

export function mapErrorToMessage(error: unknown): string {
  if (error instanceof AppError) {
    if (error.code === "NETWORK_ERROR")
      return "Network error. Please check your connection.";
    if (error.code === "HTTP_ERROR") {
      if (error.status === 404) return "Resource not found.";
      if (error.status === 400) return "Invalid request data.";
      return "Request failed. Please try again.";
    }
  }
  return "Unexpected error. Please try again.";
}
