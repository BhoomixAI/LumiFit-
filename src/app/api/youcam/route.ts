import { NextRequest, NextResponse } from "next/server";
import {
  VtoError,
  VtoPollResponse,
  VtoStartResponse,
} from "@/lib/youcam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY;

const YOUCAM_BASE_URL =
  process.env.YOUCAM_API_BASE_URL ?? "https://yce-api-01.makeupar.com";
const YOUCAM_S2S = `${YOUCAM_BASE_URL}/s2s/v2.0`;
const YOUCAM_FILE_ENDPOINT = `${YOUCAM_S2S}/file`;
const YOUCAM_TASK_ENDPOINT = `${YOUCAM_S2S}/task/cloth-v4`;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 60_000;

function bearerHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${YOUCAM_API_KEY}`,
    "Content-Type": "application/json",
  };
}

function vtoError(
  code: VtoError["code"],
  message: string,
  status?: number
): VtoError {
  return { code, message, status };
}

function parseDataUrl(input: string): { buffer: Buffer; contentType: string } {
  const [meta, b64] = input.split(",");
  if (!meta || !b64) {
    throw vtoError("invalid-input", "Invalid image data URL.");
  }
  const contentType = meta.match(/^data:([^;,]+)/i)?.[1] ?? "image/jpeg";
  const buffer = Buffer.from(b64, "base64");
  if (buffer.length === 0) {
    throw vtoError("invalid-input", "Image payload is empty.");
  }
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw vtoError(
      "invalid-input",
      "Image exceeds the 10 MB limit required by the YouCam AI Clothes API."
    );
  }
  return { buffer, contentType };
}

async function fetchAsImageBuffer(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
}> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (err) {
    throw vtoError(
      "upload",
      `Could not download the garment image: ${(err as Error).message}`,
      0
    );
  }
  if (!res.ok) {
    throw vtoError(
      "upload",
      `Could not download the garment image (HTTP ${res.status}).`,
      res.status
    );
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw vtoError(
      "invalid-input",
      "Garment image exceeds the 10 MB limit required by the YouCam AI Clothes API."
    );
  }
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  return { buffer, contentType };
}

async function uploadFile(
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const fileSize = buffer.length;
  const fileName = `lumifit-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}.${
    contentType.includes("png") ? "png" : "jpg"
  }`;

  let initRes: Response;
  try {
    initRes = await fetch(YOUCAM_FILE_ENDPOINT, {
      method: "POST",
      headers: bearerHeaders(),
      body: JSON.stringify({ files: [{ content_type: contentType, file_name: fileName, file_size: fileSize }] }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    throw vtoError(
      "upload",
      `YouCam file upload failed: ${(err as Error).message}`,
      0
    );
  }

  const initBody = await initRes.json().catch(() => null);

  if (!initRes.ok || !initBody?.data?.files?.[0]) {
    throw mapHttpError(
      initRes.status,
      initBody,
      "YouCam file upload initialization failed."
    );
  }

  const uploadTarget = initBody.data.files[0];
  const fileId: string = uploadTarget.file_id;
  const putRequest = uploadTarget.requests?.[0];

  if (!fileId || !putRequest?.url) {
    throw vtoError("upload", "YouCam did not return an upload URL.");
  }

  let putRes: Response;
  try {
    const putHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": String(fileSize),
    };
    if (putRequest.headers?.["Content-Length"]) {
      putHeaders["Content-Length"] = String(putRequest.headers["Content-Length"]);
    }
    putRes = await fetch(putRequest.url, {
      method: "PUT",
      headers: putHeaders,
      body: new Uint8Array(buffer),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    throw vtoError(
      "upload",
      `YouCam image transfer failed: ${(err as Error).message}`,
      0
    );
  }

  if (!putRes.ok) {
    throw vtoError(
      "upload",
      `YouCam image transfer failed (HTTP ${putRes.status}).`,
      putRes.status
    );
  }

  return fileId;
}

function mapHttpError(
  status: number,
  body: Record<string, unknown> | null,
  fallback: string
): VtoError {
  if (status === 401 || status === 403) {
    return vtoError(
      "auth",
      "YouCam API authentication failed. Check YOUCAM_API_KEY in .env.local.",
      status
    );
  }
  if (status === 429) {
    return vtoError(
      "rate-limit",
      "YouCam API rate limit reached. Please wait a moment and try again.",
      status
    );
  }
  const message =
    (body as { error?: string } | null)?.error ??
    (body as { error_code?: string } | null)?.error_code ??
    fallback;
  return vtoError("server", message, status);
}

function mapTaskBody(
  body: Record<string, unknown> | null
): {
  taskStatus?: string;
  resultUrl?: string;
  error?: VtoError;
} {
  if (!body) return {};
  const data = (body as { data?: Record<string, unknown> }).data;
  if (!data) return {};

  const taskStatus = typeof data.task_status === "string" ? data.task_status : undefined;
  const results = (data as { results?: { url?: string } }).results;
  const resultUrl = typeof results?.url === "string" ? results.url : undefined;

  const taskError = data.error as
    | { error_code?: string; message?: string; code?: string }
    | null
    | undefined;
  if (taskError && typeof taskError === "object") {
    const code = taskError.error_code ?? taskError.code ?? "unknown";
    return {
      taskStatus,
      resultUrl,
      error: vtoError(
        "task",
        `YouCam task failed (${code}): ${taskError.message ?? "no details provided."}`
      ),
    };
  }
  return { taskStatus, resultUrl };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!YOUCAM_API_KEY) {
    return NextResponse.json(
      { ok: false, error: vtoError("auth", "YouCam API key is not configured on the server.") } as VtoStartResponse,
      { status: 500 }
    );
  }

  let body: { srcImageDataUrl?: string; garmentImageUrl?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { srcImageDataUrl, garmentImageUrl } = body;

  if (typeof srcImageDataUrl !== "string" || !srcImageDataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { ok: false, error: vtoError("invalid-input", "A valid photo image (data URL) is required.") } as VtoStartResponse,
      { status: 400 }
    );
  }
  if (typeof garmentImageUrl !== "string" || !garmentImageUrl) {
    return NextResponse.json(
      { ok: false, error: vtoError("invalid-input", "A garment image is required.") } as VtoStartResponse,
      { status: 400 }
    );
  }

  try {
    const { buffer: srcBuffer, contentType: srcContentType } = parseDataUrl(srcImageDataUrl);

    let refBuffer: Buffer;
    let refContentType: string;
    if (garmentImageUrl.startsWith("data:image/")) {
      const parsed = parseDataUrl(garmentImageUrl);
      refBuffer = parsed.buffer;
      refContentType = parsed.contentType;
    } else {
      const fetched = await fetchAsImageBuffer(garmentImageUrl);
      refBuffer = fetched.buffer;
      refContentType = fetched.contentType;
    }

    const srcFileId = await uploadFile(srcBuffer, srcContentType);
    const refFileId = await uploadFile(refBuffer, refContentType);

    let taskRes: Response;
    try {
      taskRes = await fetch(YOUCAM_TASK_ENDPOINT, {
        method: "POST",
        headers: bearerHeaders(),
        body: JSON.stringify({
          src_file_id: srcFileId,
          ref_file_id: refFileId,
          garment_category: "auto",
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      throw vtoError(
        "server",
        `YouCam task creation failed: ${(err as Error).message}`,
        0
      );
    }

    const taskBody = await taskRes.json().catch(() => null);

    if (!taskRes.ok) {
      throw mapHttpError(taskRes.status, taskBody, "YouCam task creation failed.");
    }

    const taskId =
      (taskBody as { data?: { task_id?: string } } | null)?.data?.task_id;

    if (!taskId) {
      throw vtoError("server", "YouCam did not return a task ID.");
    }

    const response: VtoStartResponse = { ok: true, taskId };
    return NextResponse.json(response);
  } catch (err) {
    const error = err as VtoError;
    return NextResponse.json(
      { ok: false, error } as VtoStartResponse,
      { status: error.status && error.status >= 400 && error.status < 600 ? error.status : 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!YOUCAM_API_KEY) {
    return NextResponse.json(
      { ok: false, error: vtoError("auth", "YouCam API key is not configured on the server.") } as VtoPollResponse,
      { status: 500 }
    );
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json(
      { ok: false, error: vtoError("invalid-input", "A taskId query parameter is required.") } as VtoPollResponse,
      { status: 400 }
    );
  }

  try {
    let res: Response;
    try {
      res = await fetch(`${YOUCAM_TASK_ENDPOINT}/${encodeURIComponent(taskId)}`, {
        headers: bearerHeaders(),
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (err) {
      throw vtoError(
        "server",
        `YouCam status check failed: ${(err as Error).message}`,
        0
      );
    }

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw mapHttpError(res.status, body, "YouCam status check failed.");
    }

    const { taskStatus, resultUrl, error } = mapTaskBody(body);

    if (taskStatus === "error" || error) {
      return NextResponse.json(
        { ok: false, error: error ?? vtoError("task", "YouCam task failed.") } as VtoPollResponse,
        { status: 200 }
      );
    }

    const response: VtoPollResponse = {
      ok: true,
      taskStatus: taskStatus === "success" ? "success" : "running",
      resultUrl,
    };
    return NextResponse.json(response);
  } catch (err) {
    const error = err as VtoError;
    return NextResponse.json(
      { ok: false, error } as VtoPollResponse,
      { status: error.status && error.status >= 400 && error.status < 600 ? error.status : 500 }
    );
  }
}