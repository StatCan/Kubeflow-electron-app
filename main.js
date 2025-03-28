const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,  // For security, disable Node integration
      contextIsolation: true,   // Enforce context isolation
      icon: path.join(__dirname, 'assets', 'logo.png')
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
  createWindow();
});
