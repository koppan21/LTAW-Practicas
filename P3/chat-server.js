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
app.get('/', (req, res) => {
  res.send('Bienvenido al chat' + '<p><a href="/nickname.html">Chat</a></p>');
});
app.use('/', express.static(__dirname +'/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
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
    socket.emit('message', `Bienvenido al chat ${nickname}!`);
    socket.broadcast.emit('message', `${nickname} se ha unido al chat`);
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
          response = 'Hola!';
          break;
        case '/date':
          response = `Fecha y hora actual: ${new Date().toLocaleString()}`;
          break;
        default:
          response = 'Comando no reconocido. Escribe /help para obtener ayuda';
      }
      socket.emit('message', response);
    } else {
      io.emit('message', `${users[socket.id]}: ${msg}`);
    };
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} se ha desconectado`.grey);
    socket.broadcast.emit('message', `${users[socket.id]} se ha desconectado`);
    delete users[socket.id];
    io.emit('updateUserList', Object.values(users));
  });
  
});

server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);