const { app, BrowserWindow, session } = require('electron');
const { URL } = require('url')
const path = require('path');
const fs = require('fs');

// Allowed origins for this app
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const allowedOrigins = config.allowedOrigins;

let windowCount = 0;
const maxWindows = 30; // Maximum allowed windows (failsafe)

function createWindow (myUrl) {

  // Check window limit

    // Check if we've reached the limit
    if (windowCount >= maxWindows) {
      console.log('Maximum window limit reached.');
      return;
    }

    windowCount++; // Increment for a new window

  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,  // For security, disable Node integration https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
      contextIsolation: true,   // Enforce context isolation https://www.electronjs.org/docs/latest/tutorial/context-isolation
      sandbox: true, //restrict app https://www.electronjs.org/docs/latest/tutorial/sandbox
      icon: path.join(__dirname, 'assets', 'logo.png'),
      partition: 'Zone-partition', // Use the custom session
      webSecurity: true, //explicitly
      allowRunningInsecureContent: false, //explicitly
      experimentalFeatures: false
    }
  });


  // Remove the default menu to prevent default keyboard shortcuts (like reload, etc.)
  win.removeMenu();

  // To mimic fullscreen windowed, looks nicer
  win.maximize();

  // Load the desired website
  win.loadURL(myUrl); // Replace with your target URL

  // Intercept certain key events to disable Electron-specific shortcuts
  win.webContents.on('before-input-event', (event, input) => {
    // Block refresh shortcuts (F5, Ctrl+R, Cmd+R)
    if (input.key === 'F5' ||
       (input.control && input.key.toLowerCase() === 'r') ||
       (input.meta && input.key.toLowerCase() === 'r')) {
      event.preventDefault();
    }
    // Note: Avoid blocking all keys so that the website can use its own shortcuts.
  });

  // Recursively set this? 
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Create the new window using your custom function
    createWindow(url);
    // Prevent Electron from automatically creating a new window
    return { action: 'deny' };
  });

    // When the window is closed, decrement the counter
    win.on('closed', () => {
      windowCount--;
    });

}

app.whenReady().then(() => {

// Set the permission request handler for the session before creating any windows
session
.fromPartition('Zone-partition')
.setPermissionRequestHandler((webContents, permission, callback) => {
    return callback(false); // Deny all requests for permissions
});

// Navigation handler to prevent navigation to any website other than allowed ones:
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    // Allow navigation if the origin is in allowedOrigins
    if (!allowedOrigins.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// Create main app window - use home page as index
  createWindow(config.allowedOrigins[0]);
});
