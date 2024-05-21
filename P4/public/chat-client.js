const display = document.getElementById('display');
const msg_entry = document.getElementById('msg_entry');
const notificationSound = document.getElementById('notificationSound');
var userList = document.getElementById('userList');

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Crear un websocket. Conexión al servidor
const socket = io();
var nickname = getQueryParameter('nickname');
if (!nickname) {
    window.location.href = 'nickname.html';
} else {
    socket.emit('setNickname', nickname);
};

socket.on('message', (msg)=>{
    notificationSound.play();
    if (msg.server) {
        display.innerHTML += '<p class="msg-server">' + msg.text + '</p>';
    } else {
        display.innerHTML += '<p class="msg">' + msg.text + '</p>';
    }
});

// Enviar mensaje al servidor
msg_entry.onchange = () => {
    
    if (msg_entry.value) {
        socket.emit('chatMessage',msg_entry.value);
        msg_entry.value = '';
    };
};

socket.on('updateUserList', function(users) {
    userList.innerHTML = users.join('<br>');
});