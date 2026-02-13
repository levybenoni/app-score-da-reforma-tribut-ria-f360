import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 14;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;

/**
 * Generates a professional A4 PDF from a complete HTML document string.
 * Renders in an iframe, captures the full content as a single high-res image,
 * and slices it across pages for a tight, professional layout.
 */
export async function exportPdfFromHtml(
  htmlContent: string,
  filename = "diagnostico-reforma-tributaria.pdf"
): Promise<void> {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "800px",
    height: "100vh",
    border: "none",
    opacity: "0",
    pointerEvents: "none",
    zIndex: "-9999",
  });
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Could not access iframe document");

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for content to render
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      setTimeout(resolve, 2000);
    });
    await new Promise((r) => setTimeout(r, 500));

    const body = iframeDoc.body;
    if (!body) throw new Error("Iframe body not found");

    // Override styles for clean PDF capture
    body.style.background = "#ffffff";
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.overflow = "visible";

    const container = iframeDoc.querySelector(".container") as HTMLElement;
    if (container) {
      container.style.maxWidth = "100%";
      container.style.padding = "24px";
      container.style.background = "#ffffff";
      container.style.boxShadow = "none";
      container.style.borderRadius = "0";
      container.style.margin = "0";
    }

    // Expand iframe to full content height
    const scrollHeight = body.scrollHeight;
    iframe.style.height = `${scrollHeight + 100}px`;
    await new Promise((r) => setTimeout(r, 300));

    // Capture the entire content as one high-res canvas
    const targetElement = container || body;
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
    });

    // Calculate how the canvas maps to PDF pages
    const totalHeightMm = (canvas.height / canvas.width) * CONTENT_WIDTH_MM;
    const totalPages = Math.ceil(totalHeightMm / CONTENT_HEIGHT_MM);

    const pdf = new jsPDF("p", "mm", "a4");

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      // Calculate the source slice from the canvas for this page
      const sourceY = Math.round((page * CONTENT_HEIGHT_MM / totalHeightMm) * canvas.height);
      const sourceHeight = Math.round((CONTENT_HEIGHT_MM / totalHeightMm) * canvas.height);
      const actualSourceHeight = Math.min(sourceHeight, canvas.height - sourceY);

      // Create a slice canvas for this page
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = actualSourceHeight;
      const ctx = pageCanvas.getContext("2d");
      if (!ctx) continue;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, sourceY, canvas.width, actualSourceHeight,
        0, 0, canvas.width, actualSourceHeight
      );

      const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      const sliceHeightMm = (actualSourceHeight / canvas.width) * CONTENT_WIDTH_MM;

      pdf.addImage(imgData, "JPEG", MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, sliceHeightMm);
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}
