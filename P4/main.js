const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const ip = require('ip');

const PORT = 9090;
const appServer = express();
const server = http.Server(appServer);
const io = socket(server);

let users = {};

function getLocalIPAddress() {
  return ip.address();
}

// ELECTRON
console.log("Arrancando electron...");

let win = null;

app.on('ready', () => {
  console.log("Evento Ready!");

  win = new BrowserWindow({
    width: 600,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");

  win.on('ready-to-show', () => {
    const serverInfo = {
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      localIP: getLocalIPAddress(),
      port: PORT,
    };
    win.webContents.send('connectionInformation', serverInfo);
    
    const urlToQR = `http://${ip.address()}:${PORT}/`;
    qrcode.toDataURL(urlToQR, (err, qrCodeData) => {
      if (err) {
        console.error('Error al generar el QR:', err);
      } else {
        win.webContents.send('qrCodeData', qrCodeData);
      };
    });
  });
});

ipcMain.handle('get-server-info', (event) => {
  const serverInfo = {
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    localIP: getLocalIPAddress(),
    port: PORT,
  };
  return serverInfo;
});

ipcMain.handle('test', (event, msg) => {
  console.log(msg);
  io.emit('message', { text: msg, server: true } );
  win.webContents.send('message', { text: msg, server: true } );
});

// APLICACION WEB
appServer.use(bodyParser.urlencoded({ extended: true }));
appServer.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nickname.html'));
});
appServer.use(express.static('public'));
appServer.post('/set-nickname', (req, res) => {
  const nickname = req.body.nickname;
  res.redirect(`/chat.html?nickname=${nickname}`);
});

// SOCKET
io.on('connect', (socket) => {
  // Login
  socket.on('setNickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('updateUserList', Object.values(users));
    console.log(`Nuevo usuario conectado: ${nickname}`.green);
    socket.emit('message', { text: `Bienvenido al chat ${nickname}!`, server: true });
    socket.broadcast.emit('message', { text: `${nickname} se ha unido al chat`, server: true });
    win.webContents.send('updateUserList', Object.values(users));
    win.webContents.send('chatMessage', `${nickname} se ha unido al chat`);
  });

  // Mensaje recibido
  socket.on('chatMessage', (msg) => {
    console.log(`${users[socket.id]}: ` + msg.blue);
    win.webContents.send('chatMessage', `${users[socket.id]}: ${msg}`);
    if (msg.startsWith('/')) {
      let response;
      switch (msg) {
        case '/help':
          response = `Comandos disponibles:
            <br> - /help: Lista de comandos soportados
            <br> - /list: Número de usuarios conectados
            <br> - /hello: Saludo del servidor
            <br> - /date: Fecha y hora actual`;
          break;
        case '/list':
          response = `Usuarios conectados: ${Object.values(users).length}
            <br> ${Object.values(users)}`;
          break;
        case '/hello':
          response = `Hola ${users[socket.id]}!`;
          break;
        case '/date':
          response = `Fecha y hora actual: ${new Date().toLocaleString()}`;
          break;
        default:
          response = 'Comando no reconocido. Escribe /help para obtener ayuda';
      }
      socket.emit('message', { text: response, server: true });
    } else {
      io.emit('message', { text: `${users[socket.id]}: ${msg}`, server: false });
    }
  });

  // Desconexión
  socket.on('disconnect', () => {
    const nickname = users[socket.id];
    console.log(`${nickname} se ha desconectado`.grey);
    socket.broadcast.emit('message', { text: `${nickname} se ha desconectado`, server: true });
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
    win.webContents.send('updateUserList', Object.values(users));
    win.webContents.send('chatMessage', `${nickname} se ha desconectado`);
  });
});

server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);
