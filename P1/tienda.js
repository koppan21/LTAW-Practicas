const http = require('http');
const fs = require('fs');
const PUERTO = 9090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Cabecera que indica el tipo de datos del
  //-- cuerpo de la respuesta: Texto plano
  res.setHeader('Content-Type', 'text/html');

  //-- Mensaje del cuerpo
  res.write(`
  <!DOCTYPE html>

<html>
    <body>
        <p>Probando</p>
        <b>Negrita!!</b>
    </body>
</html>
`);

  //-- Terminar la respuesta y enviarla
  res.end();
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Tienda server activado!. Escuchando en puerto: " + PUERTO);
