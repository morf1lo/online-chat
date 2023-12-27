const socket = io("http://localhost:5000/socket.io", () => {
    console.log('Blablabla');
});

const chat = document.querySelector('.chat');
const form = document.querySelector('.form');
const input = document.getElementById('message');

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

const pathParts = window.location.pathname.split('/');
const roomId = pathParts[pathParts.length - 1];

socket.emit('join-room', roomId);

socket.emit('greeting-message', {
    message: `👋 Hello ${username}! Now you are with us!`,
    author: '🔧 System'
});

socket.on('greeting-message', data => {
    const parsedData = JSON.parse(data);
    appendGreetingMessage(parsedData);

    window.scrollTo(0, document.body.scrollHeight);
});

window.addEventListener('load', () => {
    loadMessages();
});

form.addEventListener('submit', event => {
    event.preventDefault();

    const message = input.value.trim();
    if (!message) return;

    socket.emit('chat-message', {
        message: message,
        author: username
    });

    input.value = '';
});

socket.on('chat-message', data => {
    const parsedData = JSON.parse(data);
    appendMessage(parsedData);

    saveMessages({
        message: parsedData.message,
        author: parsedData.author
    });

    window.scrollTo(0, document.body.scrollHeight);
});

function appendMessage(data) {
    const item = document.createElement('li');

    const usernameText = document.createElement('span');
    usernameText.classList.add('displayed-name');
    usernameText.innerText = data.author;
    
    const message = document.createElement('p');
    message.innerHTML = data.message;

    item.appendChild(usernameText);
    item.appendChild(message);

    chat.appendChild(item);
}

function appendGreetingMessage(data) {
    const item = document.createElement('li');
    item.classList.add('greeting-message');

    const usernameText = document.createElement('span');
    usernameText.classList.add('displayed-system');
    usernameText.innerText = data.system;
    usernameText.innerText = data.author;
    
    const message = document.createElement('p');
    message.innerHTML = data.message;

    item.appendChild(usernameText);
    item.appendChild(message);

    chat.appendChild(item);
}

const chatRoomKey = `chat-${roomId}`;

function saveMessages(messages) {
    const chatRoomHistory = JSON.parse(localStorage.getItem(chatRoomKey)) || [];
    chatRoomHistory.push(messages);
    localStorage.setItem(chatRoomKey, JSON.stringify(chatRoomHistory));
}

function loadMessages() {
    const chatRoomHistory = JSON.parse(localStorage.getItem(chatRoomKey)) || [];
    chatRoomHistory.forEach(item => {
        appendMessage(item);
    });
}
