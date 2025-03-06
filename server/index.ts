import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startFileWatcher, createSimpleConversationTemplate } from "./fileWatcher";
import { startSimpleFileWatcher, createSimpleConversationTemplate as createSimpleTemplate, createSimpleSampleConversations } from "./simpleFileWatcher";
import { registerSimpleRoutes } from "./simpleRoutes";
import { SimpleConversationManager } from "./simpleConversationManager";
import { registerDirectRoutes } from "./directRoutes";
import { createConversationTemplate, createSampleConversations } from "./directConversationLoader";

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

// Serve static files from the public directory
app.use(express.static('public'));
console.log('Files in the public directory are served at the root path.');
console.log('Instead of /public/MadeleinePort.jpg, use /MadeleinePort.jpg.');

(async () => {
  // Initialize the simple conversation manager
  await SimpleConversationManager.initialize();
  
  // Register both the original routes and the new simple routes
  // Original routes will be kept for backward compatibility
  const server = await registerRoutes(app);
  
  // Register our new simplified routes
  await registerSimpleRoutes(app);
  
  // Register the direct file-based conversation routes
  await registerDirectRoutes(app);

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

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Start both file watchers
    await startFileWatcher();
    await startSimpleFileWatcher();
    
    // Create template files for users to copy
    await createSimpleConversationTemplate();
    await createSimpleTemplate();
    
    // Create sample conversations with each user
    await createSimpleSampleConversations();
    
    // Create direct file-based conversations and templates
    await createConversationTemplate();
    await createSampleConversations();
  });
})();