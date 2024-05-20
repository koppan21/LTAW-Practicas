const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const ip = require('ip');

let win;

function createWindow() {
 win = new BrowserWindow({
    width: 900,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

 win.loadURL('http://localhost:9090/');

 win.on('ready-to-show', () => {
    const PUERTO = 9090;
    const clients = [];
    win.webContents.send('Connected', clients);
    win.webContents.send('conectionInformation', JSON.stringify([ip.address(), PUERTO]));
  });

 win.on('closed', function () {
   win = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if  (win === null) {
    createWindow();
  }
});

ipcMain.on('sendTestMessage', (event, message) => {
  // Aquí procesas el mensaje recibido y lo envías a los usuarios
  // Por ahora, solo loguémoslo
  console.log("Mensaje recibido en el proceso principal:", message);
});