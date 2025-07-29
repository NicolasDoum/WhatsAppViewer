import { Router } from 'express';
import { screenshotService } from './screenshotService';
import path from 'path';

const router = Router();

router.post('/api/screenshot/:conversationId', async (req, res) => {
  try {
    const conversationId = parseInt(req.params.conversationId);
    
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const screenshotPath = await screenshotService.takeScreenshot(conversationId);
    
    res.json({
      success: true,
      path: screenshotPath,
      filename: path.basename(screenshotPath)
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ 
      error: 'Failed to generate screenshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Download screenshot directly
router.get('/api/screenshot/:conversationId/download', async (req, res) => {
  try {
    const conversationId = parseInt(req.params.conversationId);
    
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const screenshotPath = await screenshotService.takeScreenshot(conversationId);
    
    res.download(screenshotPath, `whatsapp-conversation-${conversationId}.png`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download screenshot' });
      }
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ 
      error: 'Failed to generate screenshot',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;