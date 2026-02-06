import html2pdf from "html2pdf.js";

const PDF_WRAPPER_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body, html {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a2e;
      background: #ffffff;
    }

    .pdf-container {
      padding: 10px;
      background: #ffffff;
      color: #1a1a2e;
    }

    /* Headings */
    h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #754c99;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #754c99;
    }

    h2 {
      font-size: 15pt;
      font-weight: 700;
      color: #1b2a4a;
      margin-top: 24px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e0e0e0;
      page-break-after: avoid;
    }

    h3 {
      font-size: 13pt;
      font-weight: 600;
      color: #754c99;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    h4, h5, h6 {
      font-weight: 600;
      color: #1b2a4a;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin-bottom: 10px;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }

    ul, ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 4px;
      page-break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 10pt;
      page-break-inside: auto;
    }

    thead {
      background-color: #754c99;
      color: #ffffff;
    }

    th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      font-size: 10pt;
    }

    td {
      padding: 8px 12px;
      border-bottom: 1px solid #e8e8e8;
    }

    tr {
      page-break-inside: avoid;
    }

    tbody tr:nth-child(even) {
      background-color: #f8f7fa;
    }

    strong, b {
      font-weight: 600;
      color: #1b2a4a;
    }

    blockquote {
      border-left: 3px solid #754c99;
      padding: 8px 16px;
      margin: 12px 0;
      background: #f8f7fa;
      page-break-inside: avoid;
    }

    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 20px 0;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  </style>
`;

export async function exportPdfFromHtml(htmlContent: string, filename = "diagnostico-reforma-tributaria.pdf"): Promise<void> {
  const fullHtml = `
    <div class="pdf-container">
      ${PDF_WRAPPER_STYLES}
      ${htmlContent}
    </div>
  `;

  // Create container visible on screen (required by html2canvas)
  // but visually hidden behind everything
  const container = document.createElement("div");
  container.innerHTML = fullHtml;
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "794px",   // A4 width in px at 96dpi
    zIndex: "-9999",
    background: "#ffffff",
    color: "#1a1a2e",
    overflow: "visible",
    opacity: "1",      // must be 1 for html2canvas
    pointerEvents: "none",
  });
  document.body.appendChild(container);

  // Wait for fonts and rendering to settle
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const options = {
      margin: [12, 12, 16, 12], // top, right, bottom, left (mm)
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        width: 794,
        windowWidth: 794,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        avoid: ["tr", "td", "li", "h2", "h3", "h4", "blockquote"],
      },
    };

    await html2pdf().set(options).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
