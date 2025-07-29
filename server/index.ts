import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { registerDirectRoutes } from "./directRoutes";
import { createConversationTemplate, createSampleConversations } from "./directConversationLoader";
import screenshotRoutes from "./screenshotRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the public directory
app.use(express.static('public'));
console.log('Files in the public directory are served at the root path.');
console.log('Instead of /public/MadeleinePort.jpg, use /MadeleinePort.jpg.');

(async () => {
  // Register the direct file-based conversation routes
  const server = await registerDirectRoutes(app);
  
  // Add screenshot routes
  app.use(screenshotRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 5173 (avoiding macOS AirPlay conflict on 5000)
  // this serves both the API and the client
  const port = 5173;
  server.listen(port, "localhost", async () => {
    log(`serving on port ${port}`);
    
    // Create direct file-based conversations and templates
    await createConversationTemplate();
    await createSampleConversations();
  });
})();