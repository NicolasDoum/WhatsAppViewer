import { spawn } from 'child_process';
import { screenshotService } from '../server/screenshotService';
import path from 'path';

async function waitForServer(url: string, maxAttempts = 60): Promise<boolean> {
  console.log(`Waiting for server at ${url}...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      // Check if the actual screenshot route is accessible
      const response = await fetch(`${url}/screenshot/1`);
      if (response.ok || response.status === 404) { // 404 means server is up but conversation might not exist
        console.log('Server is ready!');
        return true;
      }
    } catch (e) {
      // Server not ready yet
      process.stdout.write('.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log('\nServer startup timeout');
  return false;
}

async function checkExistingServer(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5173/api/health');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const conversationId = parseInt(process.argv[2]);
  const outputPath = process.argv[3];

  if (!conversationId || isNaN(conversationId)) {
    console.error('Usage: npm run auto-screenshot <conversationId> [outputPath]');
    console.error('Example: npm run auto-screenshot 1');
    console.error('Example: npm run auto-screenshot 1 ./my-screenshot.png');
    process.exit(1);
  }

  // Check if server is already running
  const serverAlreadyRunning = await checkExistingServer();
  let serverProcess: any = null;
  
  if (serverAlreadyRunning) {
    console.log('Server already running, using existing server...');
  } else {
    console.log('Starting server...');
    
    // Kill any process on port 5173 first
    try {
      const killCmd = process.platform === 'win32' 
        ? `for /f "tokens=5" %a in ('netstat -aon ^| find ":5173"') do taskkill /F /PID %a`
        : `lsof -ti:5173 | xargs kill -9`;
      
      require('child_process').execSync(killCmd, { stdio: 'ignore' });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch {
      // Ignore errors if no process to kill
    }
    
    // Start the dev server - use npx tsx directly to avoid shell issues
    serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
      stdio: 'pipe',
      cwd: path.resolve(process.cwd())
    });

    // Capture server output for debugging
    serverProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('serving on port')) {
        console.log('Server process started successfully');
      }
    });

    serverProcess.stderr?.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    // Handle server process errors
    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
  }

  try {
    // Give server a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Wait for server to be ready
    const serverReady = await waitForServer('http://localhost:5173');
    
    if (!serverReady) {
      console.error('Server failed to start or become ready');
      process.exit(1);
    }

    // Additional delay to ensure everything is loaded
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Taking screenshot of conversation ${conversationId}...`);
    
    // Take the screenshot with retry logic
    let screenshotPath: string | null = null;
    let retries = 3;
    
    while (retries > 0 && !screenshotPath) {
      try {
        screenshotPath = await screenshotService.takeScreenshot(conversationId, outputPath);
        console.log(`Screenshot saved to: ${screenshotPath}`);
      } catch (error) {
        retries--;
        if (retries > 0) {
          console.log(`Screenshot failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Clean up
    console.log('Shutting down...');
    
    // Only kill server if we started it
    if (serverProcess) {
      // More graceful shutdown
      serverProcess.kill('SIGTERM');
      
      // Give it time to shut down gracefully
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
      }, 2000);
    }
    
    await screenshotService.close();
  }
}

main();