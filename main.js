const { app, BrowserWindow, session } = require('electron');
const { URL } = require('url')
const path = require('path');

// Allowed origins for this app
const allowedOrigins = [
  'https://zone.pages.cloud.statcan.ca', // Documentation page
  'https://zone.statcan.ca', //The actual Zone page
  'https://login.microsoftonline.com' // For authenticating login
];


function createWindow () {
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
  win.loadURL('https://zone.statcan.ca'); // Replace with your target URL

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
    // Allow navigation if the origin is in allowedOrigins or the hostname ends with '.gc.ca'
    if (!allowedOrigins.includes(parsedUrl.origin) && !parsedUrl.hostname.endsWith('.gc.ca')) {
      event.preventDefault();
    }
  });
});

// Create main app window
  createWindow();
});
