export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

export function validateFile(file: { name: string; size: number; type: string }): FileValidation {
  if (!file.name || file.name.trim() === "") {
    return { valid: false, error: "File name is required" };
  }

  if (file.size <= 0) {
    return { valid: false, error: "File is empty" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `File type "${file.type}" is not allowed. Allowed: ${ALLOWED_TYPES.join(", ")}` };
  }

  return { valid: true };
}

export async function uploadFile(
  file: { name: string; size: number; type: string },
  uploadFn: (file: { name: string; size: number; type: string }) => Promise<{ url: string }>
): Promise<UploadResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const result = await uploadFn(file);
    if (!result.url) {
      return { success: false, error: "Upload succeeded but no URL returned" };
    }
    return { success: true, url: result.url };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("timeout")) {
        return { success: false, error: "Upload timed out. Please try again." };
      }
      if (err.message.includes("401") || err.message.includes("unauthorized")) {
        return { success: false, error: "Authentication required. Please log in." };
      }
      if (err.message.includes("413") || err.message.includes("too large")) {
        return { success: false, error: "Server rejected the file as too large." };
      }
      return { success: false, error: `Upload failed: ${err.message}` };
    }
    return { success: false, error: "Upload failed due to an unknown error" };
  }
}

export async function uploadMultipleFiles(
  files: { name: string; size: number; type: string }[],
  uploadFn: (file: { name: string; size: number; type: string }) => Promise<{ url: string }>
): Promise<{ results: UploadResult[]; allSucceeded: boolean }> {
  if (files.length === 0) {
    return { results: [], allSucceeded: true };
  }

  const results = await Promise.allSettled(
    files.map((file) => uploadFile(file, uploadFn))
  );

  const uploadResults = results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return { success: false, error: "Unexpected error during upload" };
  });

  return {
    results: uploadResults,
    allSucceeded: uploadResults.every((r) => r.success),
  };
}
