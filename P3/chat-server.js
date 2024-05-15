const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');

const PORT = 9090;
const app = express();
const server = http.Server(app);
const io = socket(server);

let nUsers = 0; // Contador de usuarios

// APLICACION WEB
app.get('/', (req, res) => {
  res.send('Bienvenido al chat' + '<p><a href="/index.html">Chat</a></p>');
});

app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

// SOCKET
io.on('connect', (socket) => {
  // Conexión
  nUsers++;
  console.log('Nuevo usuario conectado'.green);
  socket.emit('message', 'Bienvenido al chat!');
  socket.broadcast.emit('message', 'Un nuevo usuario se ha conectado');
  
  // Desconexión
  socket.on('disconnect', ()=>{
    nUsers--;
    console.log('Un usuario se ha desconectado'.grey);
    io.emit('message', 'Un usuario se ha desconectado');
  });  

  // Mensaje recibido
  socket.on('chatMessage', (msg) => {
    console.log('Mensaje recibido: ' + msg.blue);
    if (msg.startsWith('/')) {
      let response;
      switch (msg) {
        case '/help':
          response = 'Comandos disponibles: /help, /list, /hello, /date';
          break;
        case '/list':
          response = 'Usuarios';
          break;
        case '/hello':
          response = `Usuarios conectados: ${nUsers}`;
          break;
        case '/date':
          response = `Fecha actual: ${new Date().toLocaleString()}`;
          break;
        default:
          response = 'Comando no reconocido';
      }
      socket.emit('message', response);
    } else {
      io.emit('message',msg);
    };
  });
  
});

server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);