const http = require('http');
const fs = require('fs');
const path = require('path');

const { error } = require('console');

const PUERTO = 9090;

//-- Servidor
const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/tienda.html' : req.url;
  const filePath = path.join(__dirname, url);

  const extname = String(path.extname(filePath)).toLowerCase();

  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
  };

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Si el archivo no se encuentra, muestra un error 404
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
        console.log("ERROR 404")
        console.log(error.message);
      } else {
        // Si ocurre otro tipo de error, muestra un error 500
        res.writeHead(500);
        res.end(`Error: ${err.code}`);
        console.log("ERROR 500")
        console.log(error.message);
      }
      return;
    }
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data, 'utf-8');
  });
});

//-- Activar el servidor
server.listen(PUERTO);
console.log("Tienda server activado!. Escuchando en puerto: " + PUERTO);
