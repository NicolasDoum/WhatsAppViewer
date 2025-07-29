import { screenshotService } from '../server/screenshotService';

async function main() {
  const conversationId = parseInt(process.argv[2]);
  const outputPath = process.argv[3];

  if (!conversationId || isNaN(conversationId)) {
    console.error('Usage: npm run quick-screenshot <conversationId> [outputPath]');
    console.error('Example: npm run quick-screenshot 1');
    console.error('Example: npm run quick-screenshot 1 ./my-screenshot.png');
    process.exit(1);
  }

  try {
    console.log(`Taking screenshot of conversation ${conversationId}...`);
    
    const screenshotPath = await screenshotService.takeScreenshot(conversationId, outputPath);
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
    console.error('\nMake sure the dev server is running: npm run dev');
    process.exit(1);
  } finally {
    await screenshotService.close();
  }
}

main();