import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export class ScreenshotService {
  private browser: puppeteer.Browser | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async takeScreenshot(conversationId: number, outputPath?: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    const page = await this.browser!.newPage();
    
    try {
      // Set viewport to wider size for better message separation
      await page.setViewport({
        width: 600,
        height: 852,
        deviceScaleFactor: 2
      });

      // Navigate to the screenshot page with increased timeout
      const url = `http://localhost:5173/screenshot/${conversationId}`;
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 60000 // Increase timeout to 60 seconds
      });

      // Add puppeteer-screenshot class to remove padding
      await page.evaluate(() => {
        document.body.classList.add('puppeteer-screenshot');
      });

      // Small delay to ensure CSS is applied
      await new Promise(resolve => setTimeout(resolve, 100));

      // Wait for messages to load with increased timeout
      // The messages are rendered in divs with bg-whatsapp-light-green or bg-white classes
      await page.waitForSelector('.bg-whatsapp-light-green, .bg-white', { timeout: 30000 });

      // Optional: Wait for images to load
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
            }))
        );
      });

      // Take screenshot
      const screenshotPath = outputPath || path.join(
        process.cwd(),
        'screenshots',
        `conversation-${conversationId}-${Date.now()}.png`
      );

      // Ensure directory exists
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });

      await page.screenshot({
        path: screenshotPath,
        fullPage: false // Only capture viewport (one screen)
      });

      return screenshotPath;
    } finally {
      await page.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Singleton instance
export const screenshotService = new ScreenshotService();