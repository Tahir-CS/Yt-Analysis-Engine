import puppeteer from 'puppeteer';

/**
 * ============================================================================
 * SYSTEM DESIGN CONCEPT: HEADLESS BROWSER AUTOMATION FOR REPORTING
 * ----------------------------------------------------------------------------
 * Generating rich, highly-styled PDF reports (with charts, images, grid layouts)
 * using standard PDF libraries (like PDFKit) is extremely tedious and fragile.
 * 
 * Instead, we leverage Puppeteer to launch a headless Chrome instance.
 * We can simply serve a dynamic HTML/React route (e.g. `/report/:creatorId`),
 * point Puppeteer to that URL, let it render the DOM and CSS normally, 
 * and then snapshot the perfectly styled page to a PDF buffer.
 * ============================================================================
 */
export async function generateCreatorReportPDF(creatorId: number, htmlContent?: string): Promise<Buffer> {
  let browser;
  try {
    // Launch headless Chromium. In Docker, we often need specific args for it to run.
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set standard viewport for A4 rendering
    await page.setViewport({ width: 1200, height: 1600 });

    if (htmlContent) {
      // Direct HTML injection (Useful if you compile a Handlebars/EJS template)
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    } else {
      // Or we can navigate to our React app's hidden report route
      // e.g. http://localhost:3000/reports/creator/123
      const reportUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reports/creator/${creatorId}`;
      await page.goto(reportUrl, { waitUntil: 'networkidle0' });
    }

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Ensures CSS backgrounds (dark mode etc.) are captured
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    return pdfBuffer;

  } catch (error: any) {
    console.error(`[Report Generator] Failed to create PDF for Creator ${creatorId}:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
