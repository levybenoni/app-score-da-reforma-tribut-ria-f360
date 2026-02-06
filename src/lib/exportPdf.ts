import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generates a professional A4 PDF from a complete HTML document string.
 * Uses an iframe to properly render the full HTML (with its own <head>/<style>),
 * then captures via html2canvas and outputs a multi-page PDF.
 */
export async function exportPdfFromHtml(
  htmlContent: string,
  filename = "diagnostico-reforma-tributaria.pdf"
): Promise<void> {
  // Create a hidden iframe to render the full HTML document correctly
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "794px",        // A4 width at ~96dpi
    height: "1122px",      // A4 height at ~96dpi
    border: "none",
    opacity: "0",
    pointerEvents: "none",
    zIndex: "-9999",
  });
  document.body.appendChild(iframe);

  try {
    // Write the complete HTML into the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Could not access iframe document");
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Wait for content + fonts to fully render
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      // Fallback timeout in case onload doesn't fire
      setTimeout(resolve, 2000);
    });

    // Additional settle time for fonts/images
    await new Promise((r) => setTimeout(r, 500));

    const body = iframeDoc.body;
    if (!body) {
      throw new Error("Iframe body not found");
    }

    // Ensure body has white background for capture
    body.style.background = "#ffffff";
    body.style.margin = "0";
    body.style.padding = "20px";

    // Let iframe expand to full content height for complete capture
    const scrollHeight = body.scrollHeight;
    iframe.style.height = `${scrollHeight}px`;

    // Wait for resize to settle
    await new Promise((r) => setTimeout(r, 300));

    // Capture the iframe body with html2canvas
    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794,
      windowWidth: 794,
      height: scrollHeight,
      backgroundColor: "#ffffff",
    });

    // A4 dimensions in mm
    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const marginMm = 12;

    const contentWidthMm = pageWidthMm - marginMm * 2;
    const contentHeightMm = pageHeightMm - marginMm * 2;

    // Calculate image dimensions
    const imgWidthMm = contentWidthMm;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    let heightLeftMm = imgHeightMm;
    let positionMm = marginMm;

    // First page
    pdf.addImage(imgData, "JPEG", marginMm, positionMm, imgWidthMm, imgHeightMm);
    heightLeftMm -= contentHeightMm;

    // Additional pages
    while (heightLeftMm > 0) {
      pdf.addPage();
      positionMm = marginMm - (imgHeightMm - heightLeftMm);
      pdf.addImage(imgData, "JPEG", marginMm, positionMm, imgWidthMm, imgHeightMm);
      heightLeftMm -= contentHeightMm;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}
