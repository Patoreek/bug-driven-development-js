import { validateFile, uploadFile, uploadMultipleFiles } from "../FileUploader";

const validFile = {
  name: "photo.jpg",
  size: 1024 * 1024,
  type: "image/jpeg",
};

const mockUploadFn = vi.fn();

describe("validateFile", () => {
  it("should accept a valid JPEG file", () => {
    const result = validateFile(validFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should accept a valid PDF file", () => {
    const result = validateFile({ name: "doc.pdf", size: 2048, type: "application/pdf" });
    expect(result.valid).toBe(true);
  });

  it("should reject a file with empty name", () => {
    const result = validateFile({ name: "", size: 1024, type: "image/jpeg" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("File name is required");
  });

  it("should reject a file with whitespace-only name", () => {
    const result = validateFile({ name: "   ", size: 1024, type: "image/jpeg" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("File name is required");
  });

  it("should reject an empty file (size 0)", () => {
    const result = validateFile({ name: "empty.jpg", size: 0, type: "image/jpeg" });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("File is empty");
  });

  it("should reject a file exceeding maximum size", () => {
    const result = validateFile({ name: "huge.jpg", size: 6 * 1024 * 1024, type: "image/jpeg" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("exceeds maximum size");
  });

  it("should accept a file exactly at the maximum size", () => {
    const result = validateFile({ name: "max.jpg", size: 5 * 1024 * 1024, type: "image/jpeg" });
    expect(result.valid).toBe(true);
  });

  it("should reject a disallowed file type", () => {
    const result = validateFile({ name: "script.js", size: 1024, type: "application/javascript" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not allowed");
  });

  it("should reject an executable file type", () => {
    const result = validateFile({ name: "app.exe", size: 1024, type: "application/x-msdownload" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("not allowed");
  });
});

describe("uploadFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload a valid file successfully", async () => {
    mockUploadFn.mockResolvedValueOnce({ url: "https://cdn.example.com/photo.jpg" });

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(true);
    expect(result.url).toBe("https://cdn.example.com/photo.jpg");
  });

  it("should return validation error for invalid file", async () => {
    const result = await uploadFile(
      { name: "", size: 1024, type: "image/jpeg" },
      mockUploadFn
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe("File name is required");
    expect(mockUploadFn).not.toHaveBeenCalled();
  });

  it("should handle timeout errors", async () => {
    mockUploadFn.mockRejectedValueOnce(new Error("Request timeout"));

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Upload timed out. Please try again.");
  });

  it("should handle authentication errors", async () => {
    mockUploadFn.mockRejectedValueOnce(new Error("401 unauthorized"));

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Authentication required. Please log in.");
  });

  it("should handle server size rejection", async () => {
    mockUploadFn.mockRejectedValueOnce(new Error("413 entity too large"));

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Server rejected the file as too large.");
  });

  it("should handle generic errors", async () => {
    mockUploadFn.mockRejectedValueOnce(new Error("Something went wrong"));

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Upload failed: Something went wrong");
  });

  it("should handle non-Error thrown values", async () => {
    mockUploadFn.mockRejectedValueOnce("string error");

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Upload failed due to an unknown error");
  });

  it("should handle upload returning no URL", async () => {
    mockUploadFn.mockResolvedValueOnce({ url: "" });

    const result = await uploadFile(validFile, mockUploadFn);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Upload succeeded but no URL returned");
  });
});

describe("uploadMultipleFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should upload multiple files successfully", async () => {
    mockUploadFn
      .mockResolvedValueOnce({ url: "https://cdn.example.com/photo.jpg" })
      .mockResolvedValueOnce({ url: "https://cdn.example.com/doc.pdf" });

    const files = [
      validFile,
      { name: "doc.pdf", size: 2048, type: "application/pdf" },
    ];

    const result = await uploadMultipleFiles(files, mockUploadFn);

    expect(result.allSucceeded).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].url).toBe("https://cdn.example.com/photo.jpg");
    expect(result.results[1].url).toBe("https://cdn.example.com/doc.pdf");
  });

  it("should return empty results for empty file array", async () => {
    const result = await uploadMultipleFiles([], mockUploadFn);

    expect(result.results).toHaveLength(0);
    expect(result.allSucceeded).toBe(true);
    expect(mockUploadFn).not.toHaveBeenCalled();
  });

  it("should handle partial failures", async () => {
    mockUploadFn
      .mockResolvedValueOnce({ url: "https://cdn.example.com/photo.jpg" })
      .mockRejectedValueOnce(new Error("Network error"));

    const files = [
      validFile,
      { name: "doc.pdf", size: 2048, type: "application/pdf" },
    ];

    const result = await uploadMultipleFiles(files, mockUploadFn);

    expect(result.allSucceeded).toBe(false);
    expect(result.results[0].success).toBe(true);
    expect(result.results[1].success).toBe(false);
  });

  it("should handle all files failing", async () => {
    mockUploadFn
      .mockRejectedValueOnce(new Error("Server down"))
      .mockRejectedValueOnce(new Error("Server down"));

    const files = [
      validFile,
      { name: "doc.pdf", size: 2048, type: "application/pdf" },
    ];

    const result = await uploadMultipleFiles(files, mockUploadFn);

    expect(result.allSucceeded).toBe(false);
    expect(result.results.every((r) => !r.success)).toBe(true);
  });

  it("should handle mix of validation failures and upload errors", async () => {
    mockUploadFn.mockResolvedValueOnce({ url: "https://cdn.example.com/photo.jpg" });

    const files = [
      validFile,
      { name: "script.js", size: 1024, type: "application/javascript" }, // Invalid type
    ];

    const result = await uploadMultipleFiles(files, mockUploadFn);

    expect(result.allSucceeded).toBe(false);
    expect(result.results[0].success).toBe(true);
    expect(result.results[1].success).toBe(false);
    expect(result.results[1].error).toContain("not allowed");
  });
});
