export type AppErrorCode = "NETWORK_ERROR" | "HTTP_ERROR" | "UNKNOWN_ERROR";

export class AppError extends Error {
  code: AppErrorCode;
  status?: number;

  constructor(code: AppErrorCode, message: string, status?: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}
