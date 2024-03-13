const http = require('http');
const fs = require('fs');
const path = require('path');
const { error } = require('console');

const PUERTO = 9090;

//-- Servidor
const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/tienda.html' : req.url;
  const filePath = path.join(__dirname, url);
  const extension = path.extname(filePath);
  let contentType = 'text/html';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      console.log("ERROR")
      console.log(error.message);
      // incluir angry server
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data, 'utf8');
    }
  });
});

//-- Activar el servidor
server.listen(PUERTO);
console.log("Tienda server activado!. Escuchando en puerto: " + PUERTO);
