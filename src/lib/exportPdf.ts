import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 14;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SECTION_GAP_MM = 3;

/**
 * Generates a professional A4 PDF from a complete HTML document string.
 * Uses an iframe for proper rendering, captures each logical section
 * individually, and places them on pages without cutting content.
 */
export async function exportPdfFromHtml(
  htmlContent: string,
  filename = "diagnostico-reforma-tributaria.pdf"
): Promise<void> {
  // Create iframe to properly render the full HTML document
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "794px",
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

    // Override body styles for clean PDF capture
    body.style.background = "#ffffff";
    body.style.margin = "0";
    body.style.padding = "20px";

    // Expand iframe to full content height
    const scrollHeight = body.scrollHeight;
    iframe.style.height = `${scrollHeight}px`;
    await new Promise((r) => setTimeout(r, 300));

    // Find logical sections to capture individually
    const sections = findSections(iframeDoc);

    if (sections.length === 0) {
      // Fallback: capture the entire body as one section
      sections.push(body);
    }

    // Capture each section as a canvas
    const sectionImages: { imgData: string; heightMm: number }[] = [];

    for (const section of sections) {
      const canvas = await html2canvas(section as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 754, // content area width (794 - 40px padding)
      });

      const scaleFactor = CONTENT_WIDTH_MM / canvas.width;
      const heightMm = canvas.height * scaleFactor;
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      sectionImages.push({ imgData, heightMm });
    }

    // Build the PDF placing sections on pages without cutting
    const pdf = new jsPDF("p", "mm", "a4");
    let currentY = MARGIN_MM;

    for (let i = 0; i < sectionImages.length; i++) {
      const { imgData, heightMm } = sectionImages[i];
      const remainingSpace = A4_HEIGHT_MM - MARGIN_MM - currentY;

      // If section doesn't fit on current page and we're not at the top, add new page
      if (heightMm > remainingSpace && currentY > MARGIN_MM + 1) {
        pdf.addPage();
        currentY = MARGIN_MM;
      }

      // If a single section is taller than a full page, we need to split it
      if (heightMm > CONTENT_HEIGHT_MM) {
        // Fall back to slicing this large section across pages
        await addLargeSectionToPdf(pdf, imgData, heightMm, currentY);
        // After a large section, start fresh on a new page
        pdf.addPage();
        currentY = MARGIN_MM;
      } else {
        pdf.addImage(imgData, "JPEG", MARGIN_MM, currentY, CONTENT_WIDTH_MM, heightMm);
        currentY += heightMm + SECTION_GAP_MM;
      }
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}

/**
 * Finds logical section elements in the document that should not be split.
 * Looks for .block, .section, h1, .subtitle, .badge, .impact, and other
 * top-level elements within the .container.
 */
function findSections(doc: Document): Element[] {
  const container = doc.querySelector(".container");
  if (!container) {
    // No container found — return all direct children of body
    return Array.from(doc.body.children).filter(
      (el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE"
    );
  }

  const sections: Element[] = [];

  // Walk through top-level children of .container
  for (const child of Array.from(container.children)) {
    const tag = child.tagName.toLowerCase();
    const className = child.className || "";

    // If it's a .section that contains .block children, split into blocks
    if (className.includes("section")) {
      const blocks = child.querySelectorAll(".block");
      if (blocks.length > 0) {
        // Add any non-block children first (like the h2 header)
        for (const sectionChild of Array.from(child.children)) {
          if (
            !sectionChild.classList.contains("block") &&
            sectionChild.tagName !== "SCRIPT"
          ) {
            sections.push(sectionChild);
          }
        }
        // Then add each block individually
        blocks.forEach((block) => sections.push(block));
      } else {
        // Section without blocks — add as one piece
        sections.push(child);
      }
    } else if (tag === "h1" || tag === "h2" || tag === "h3") {
      sections.push(child);
    } else {
      sections.push(child);
    }
  }

  return sections;
}

/**
 * Adds a section that is taller than one page by slicing it across pages.
 */
function addLargeSectionToPdf(
  pdf: jsPDF,
  imgData: string,
  totalHeightMm: number,
  startY: number
): Promise<void> {
  let heightLeft = totalHeightMm;
  let position = startY;
  const isFirstSlice = true;

  // First slice
  pdf.addImage(
    imgData,
    "JPEG",
    MARGIN_MM,
    position,
    CONTENT_WIDTH_MM,
    totalHeightMm
  );
  heightLeft -= (A4_HEIGHT_MM - MARGIN_MM - startY);

  // Subsequent slices
  while (heightLeft > 0) {
    pdf.addPage();
    position = MARGIN_MM - (totalHeightMm - heightLeft);
    pdf.addImage(
      imgData,
      "JPEG",
      MARGIN_MM,
      position,
      CONTENT_WIDTH_MM,
      totalHeightMm
    );
    heightLeft -= CONTENT_HEIGHT_MM;
  }

  return Promise.resolve();
}
