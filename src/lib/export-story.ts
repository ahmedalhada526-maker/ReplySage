import { toPng } from "html-to-image";

/**
 * Generate a branded PNG of the given DOM element and trigger a download.
 * Used by the "Export to Story" button.
 */
export async function exportElementAsStory(
  el: HTMLElement,
  filename = "replysage-story.png",
): Promise<void> {
  const dataUrl = await toPng(el, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#0a0a14",
  });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
