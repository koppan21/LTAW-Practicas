const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 9090;
const app = express();
const server = http.Server(app);
const io = socket(server);

let users = {};

// APLICACION WEB
app.use('/', express.static(__dirname +'/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','index.html'));
});
app.post('/set-nickname', (req, res) => {
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
  });

  // Mensaje recibido
  socket.on('chatMessage', (msg) => {
    console.log(`${users[socket.id]}: ` + msg.blue);
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
    };
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} se ha desconectado`.grey);
    socket.broadcast.emit('message', { text: `${users[socket.id]} se ha desconectado`, server: true });
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
  });
  
});

server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);