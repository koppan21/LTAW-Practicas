const { ipcRenderer } = require('electron');
const messageList = document.getElementById('message-list');

// Obtener información del servidor
ipcRenderer.invoke('get-server-info').then((serverInfo) => {
    document.getElementById('node-version').innerText = serverInfo.nodeVersion;
    document.getElementById('electron-version').innerText = serverInfo.electronVersion;
    document.getElementById('chrome-version').innerText = serverInfo.chromeVersion;
    document.getElementById('server-url').innerText = `http://${serverInfo.localIP}:${serverInfo.port}`;
});

// Recibir mensajes desde el servidor
ipcRenderer.on('chatMessage', (event, msg) => {
    const newMessage = document.createElement('p');
    newMessage.innerText = msg;
    messageList.appendChild(newMessage);
});

// Actualizar lista de usuarios conectados
ipcRenderer.on('updateUserList', (event, users) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear current list
    users.forEach(user => {
    const newUser = document.createElement('li');
    newUser.innerText = user;
    userList.appendChild(newUser);
    });
});

// Enviar mensaje de prueba al hacer clic en el botón
document.getElementById('test-button').addEventListener('click', () => {
    ipcRenderer.invoke('test', 'Mensaje de prueba desde el server');
    messageList.appendChild('Mensaje de prueba desde el server');
});