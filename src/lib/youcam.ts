export type VtoErrorKind =
  | "invalid-input"
  | "auth"
  | "rate-limit"
  | "server"
  | "upload"
  | "task"
  | "timeout";

export interface VtoError {
  code: VtoErrorKind;
  message: string;
  status?: number;
}

export interface VtoStartRequest {
  srcImageDataUrl: string;
  garmentImageUrl: string;
  garmentName?: string;
}

export interface VtoStartResponse {
  ok: boolean;
  taskId?: string;
  error?: VtoError;
}

export type VtoTaskStatus = "running" | "success" | "error";

export interface VtoPollResponse {
  ok: boolean;
  taskStatus?: VtoTaskStatus;
  resultUrl?: string;
  elapsedMs?: number;
  error?: VtoError;
}