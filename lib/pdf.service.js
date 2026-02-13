const puppeteer = require("puppeteer");
const puppeteerCore = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const templateService = require("./template.service");

/**
 * Get browser configuration based on environment
 */
async function getBrowserInstance() {
  const isProduction = process.env.NODE_ENV === "production";
  const isRender = process.env.RENDER === "true";
  const isVercel = process.env.VERCEL === "1";
  const isLinux = process.platform === "linux";

  if (isProduction && (isRender || isVercel || isLinux)) {
    console.log("🚀 Using @sparticuz/chromium for production environment");
    const browser = await puppeteerCore.launch({
      args: [
        ...chromium.args,
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--single-process",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    console.log("✅ Successfully launched Chromium for production");
    return browser;
  }

  console.log("💻 Using regular Puppeteer for local environment");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=none",
      "--disable-font-subpixel-positioning",
    ],
  });
  console.log("✅ Successfully launched local Puppeteer");
  return browser;
}

const generatePDF = async (options) => {
  let browser = null;
  try {
    console.log("📄 Starting PDF generation...");
    const html = templateService.generateHTMLATT(options);
    browser = await getBrowserInstance();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    // await page.evaluateHandle('document.fonts.ready');
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "20mm", bottom: "15mm", left: "20mm" },
      waitForFonts: true,
      displayHeaderFooter: false,
    });
    if (!Buffer.isBuffer(pdfBuffer)) {
      return Buffer.from(pdfBuffer);
    }
    return pdfBuffer;
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    throw new Error("Erreur lors de la génération du PDF: " + error.message);
  } finally {
    if (browser) await browser.close();
  }
};

const generateMultiPagePDF = async (dataArray, baseOptions = {}) => {
  let browser = null;
  try {
    console.log(`📄 Starting multi-page PDF generation (${dataArray.length} pages)...`);
    browser = await getBrowserInstance();
    const page = await browser.newPage();
    const firstPageHTML = templateService.generateHTMLBCLG({ ...baseOptions, ...dataArray[0] });
    const headMatch = firstPageHTML.match(/<head>([\s\S]*?)<\/head>/i);
    const head = headMatch ? headMatch[1] : "";
    let combinedBody = "";
    for (let i = 0; i < dataArray.length; i++) {
      const pageOptions = { ...baseOptions, ...dataArray[i] };
      const pageHTML = templateService.generateHTMLBCLG(pageOptions);
      const bodyMatch = pageHTML.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : "";
      combinedBody += bodyContent + (i < dataArray.length - 1 ? '<div style="page-break-after: always;"></div>' : "");
    }
    const fullHTML = `<!DOCTYPE html><html><head>${head}</head><body>${combinedBody}</body></html>`;
    await page.setContent(fullHTML, { waitUntil: "domcontentloaded", timeout: 3000 });
    // await page.setContent(fullHTML, {
    //   waitUntil: "networkidle0",
    // });
    // await page.evaluateHandle('document.fonts.ready');
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", right: "20mm", bottom: "15mm", left: "20mm" },
      waitForFonts: true,
      displayHeaderFooter: false,
    });
    return Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ Multi-page PDF Generation Error:", error);
    throw new Error("Erreur lors de la génération du PDF multi-pages: " + error.message);
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { generatePDF, generateMultiPagePDF };
