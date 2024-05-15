const display = document.getElementById('display');
const msg_entry = document.getElementById('msg_entry');

// Crear un websocket. Conexión al servidor
const socket = io();

socket.on('message', (msg)=>{
    display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
    if (msg_entry.value)
        socket.emit('chatMessage',msg_entry.value);
  
    msg_entry.value = '';
}