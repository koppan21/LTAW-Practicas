const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');

const PORT = 9090;
const app = express();
const server = http.Server(app);
const io = socket(server);

// APLICACION WEB
app.get('/', (req, res) => {
  res.send('Bienvenido al chat' + '<p><a href="/index.html">Chat</a></p>');
});

app.use('/', express.static(__dirname +'/'));
app.use(express.static('public'));

// SOCKET
io.on('connect', (socket) => {
  // Conexión
  console.log('** NUEVA CONEXIÓN **'.green);
  
  // Desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.grey);
  });  

  // Mensaje recibido
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

    // Reenviarlo a todos los clientes conectados
    io.send(msg);
  });
  
});

server.listen(PORT);
console.log("Escuchando en puerto: " + PORT);