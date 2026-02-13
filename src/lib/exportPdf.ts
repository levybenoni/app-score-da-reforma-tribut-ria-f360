import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_MM = 14;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
const SECTION_GAP_MM = 2;

/**
 * Generates a professional A4 PDF from a complete HTML document string.
 * Renders in an iframe, captures each logical section individually,
 * and places them on pages without cutting content.
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

    // Find logical sections to capture
    const sections = findSections(iframeDoc);
    if (sections.length === 0) {
      sections.push(body);
    }

    // Measure the content area width for consistent scaling
    const targetElement = container || body;
    const elementWidth = targetElement.offsetWidth;

    // Capture each section
    const sectionImages: { imgData: string; heightMm: number }[] = [];

    for (const section of sections) {
      const el = section as HTMLElement;

      // Skip invisible/empty elements
      if (el.offsetHeight < 2) continue;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      });

      // Use actual canvas dimensions for accurate height calculation
      const heightMm = (canvas.height / canvas.width) * CONTENT_WIDTH_MM;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      sectionImages.push({ imgData, heightMm });
    }

    // Build PDF with smart page breaks
    const pdf = new jsPDF("p", "mm", "a4");
    let currentY = MARGIN_MM;

    for (let i = 0; i < sectionImages.length; i++) {
      const { imgData, heightMm } = sectionImages[i];
      const remainingSpace = A4_HEIGHT_MM - MARGIN_MM - currentY;

      // If section doesn't fit and we're not at top, start new page
      if (heightMm > remainingSpace && currentY > MARGIN_MM + 1) {
        pdf.addPage();
        currentY = MARGIN_MM;
      }

      // If a single section is taller than a full page, slice it
      if (heightMm > CONTENT_HEIGHT_MM) {
        addLargeSectionToPdf(pdf, imgData, CONTENT_WIDTH_MM, heightMm, currentY);
        // Calculate where we end up after the large section
        const totalPages = Math.ceil(heightMm / CONTENT_HEIGHT_MM);
        const usedOnLastPage = heightMm - (totalPages - 1) * CONTENT_HEIGHT_MM;
        currentY = MARGIN_MM + usedOnLastPage + SECTION_GAP_MM;
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
 * Finds logical section elements that should be kept together on pages.
 * Groups small elements (h2, subtitle, badge) with their next sibling
 * to avoid tiny sections that waste page space.
 */
function findSections(doc: Document): Element[] {
  const container = doc.querySelector(".container");
  if (!container) {
    return Array.from(doc.body.children).filter(
      (el) => el.tagName !== "SCRIPT" && el.tagName !== "STYLE"
    );
  }

  const sections: Element[] = [];
  const children = Array.from(container.children);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const tag = child.tagName.toLowerCase();
    const className = child.className || "";

    if (tag === "script" || tag === "style") continue;

    // If it's a .section with .block children, split into blocks
    if (className.includes("section")) {
      const blocks = child.querySelectorAll(".block");
      if (blocks.length > 0) {
        // Collect non-block children (h2 headers etc) - group with first block
        const nonBlockChildren: Element[] = [];
        for (const sectionChild of Array.from(child.children)) {
          if (!sectionChild.classList.contains("block") && sectionChild.tagName !== "SCRIPT") {
            nonBlockChildren.push(sectionChild);
          }
        }

        // If there are headers before blocks, group them with first block
        // by wrapping in a temp container
        if (nonBlockChildren.length > 0) {
          const wrapper = doc.createElement("div");
          wrapper.style.cssText = "page-break-inside: avoid;";
          for (const nbc of nonBlockChildren) {
            wrapper.appendChild(nbc.cloneNode(true) as Element);
          }
          // Also include the first block in this wrapper
          if (blocks[0]) {
            wrapper.appendChild(blocks[0].cloneNode(true) as Element);
            container.insertBefore(wrapper, child);
            sections.push(wrapper);
            // Add remaining blocks individually
            for (let b = 1; b < blocks.length; b++) {
              sections.push(blocks[b]);
            }
          }
        } else {
          blocks.forEach((block) => sections.push(block));
        }
      } else {
        sections.push(child);
      }
    } else {
      // For small standalone elements (h1, subtitle, badge),
      // group them with the next element to avoid tiny sections
      const el = child as HTMLElement;
      if (
        (tag === "h1" || tag === "h2" || tag === "h3" ||
          className.includes("subtitle") || className.includes("badge")) &&
        i + 1 < children.length
      ) {
        // Check if next element is also small, keep grouping
        const wrapper = doc.createElement("div");
        wrapper.style.cssText = "page-break-inside: avoid;";
        wrapper.appendChild(child.cloneNode(true) as Element);

        // Group with subsequent small elements
        while (
          i + 1 < children.length &&
          isSmallElement(children[i + 1])
        ) {
          i++;
          wrapper.appendChild(children[i].cloneNode(true) as Element);
        }

        // Also grab the next regular element to avoid orphan headers
        if (i + 1 < children.length && !children[i + 1].className?.includes("section")) {
          i++;
          wrapper.appendChild(children[i].cloneNode(true) as Element);
        }

        container.appendChild(wrapper);
        sections.push(wrapper);
      } else {
        sections.push(child);
      }
    }
  }

  return sections;
}

function isSmallElement(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const className = el.className || "";
  return (
    tag === "h1" || tag === "h2" || tag === "h3" ||
    className.includes("subtitle") || className.includes("badge") ||
    (el as HTMLElement).offsetHeight < 60
  );
}

/**
 * Adds a section taller than one page by placing it across multiple pages.
 */
function addLargeSectionToPdf(
  pdf: jsPDF,
  imgData: string,
  widthMm: number,
  totalHeightMm: number,
  startY: number
): void {
  let heightLeft = totalHeightMm;
  let position = startY;

  // First page slice
  pdf.addImage(imgData, "JPEG", MARGIN_MM, position, widthMm, totalHeightMm);
  heightLeft -= (A4_HEIGHT_MM - MARGIN_MM - startY);

  // Subsequent pages
  while (heightLeft > 0) {
    pdf.addPage();
    position = MARGIN_MM - (totalHeightMm - heightLeft);
    pdf.addImage(imgData, "JPEG", MARGIN_MM, position, widthMm, totalHeightMm);
    heightLeft -= CONTENT_HEIGHT_MM;
  }
}
