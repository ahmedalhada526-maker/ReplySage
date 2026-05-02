/**
 * Mock OCR — pure presentation. Real OCR (e.g. Tesseract.js or a server route)
 * can be plugged in later by replacing extractTextFromImage().
 *
 * For now: we simulate processing time then return null to prompt the user
 * to paste manually if they uploaded a non-text image. If the file name
 * suggests a chat export (.txt fallback) we read it as text.
 */
export interface OcrResult {
  text: string | null;
  reason?: "unreadable" | "unsupported";
}

export async function extractTextFromImage(file: File): Promise<OcrResult> {
  // Simulate a short processing delay so the UI feels real.
  await new Promise((r) => setTimeout(r, 900));

  // For PoC: return null so we prompt the user to paste manually.
  // The real implementation would run Tesseract.js or hit a server OCR route.
  if (!file.type.startsWith("image/")) {
    return { text: null, reason: "unsupported" };
  }
  return { text: null, reason: "unreadable" };
}
