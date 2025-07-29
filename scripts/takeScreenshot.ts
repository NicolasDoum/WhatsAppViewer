import { screenshotService } from '../server/screenshotService';

async function main() {
  const conversationId = parseInt(process.argv[2]);
  const outputPath = process.argv[3];

  if (!conversationId || isNaN(conversationId)) {
    console.error('Usage: npm run screenshot <conversationId> [outputPath]');
    console.error('Example: npm run screenshot 1');
    console.error('Example: npm run screenshot 1 ./my-screenshot.png');
    process.exit(1);
  }

  try {
    console.log(`Taking screenshot of conversation ${conversationId}...`);
    
    // Make sure the dev server is running
    console.log('Note: Make sure the dev server is running (npm run dev)');
    
    const path = await screenshotService.takeScreenshot(conversationId, outputPath);
    console.log(`Screenshot saved to: ${path}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  } finally {
    await screenshotService.close();
  }
}

main();