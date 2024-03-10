const http = require('http');

const PUERTO = 8080;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Cabecera que indica el tipo de datos del
  //-- cuerpo de la respuesta: Texto plano
  res.setHeader('Content-Type', 'text/plain');

  //-- Mensaje del cuerpo
  res.write("Soy el Happy server!!\n");

  //-- Terminar la respuesta y enviarla
  res.end();
});

server.listen(PUERTO);
console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);

// curl -vv  'http://localhost:8080/'