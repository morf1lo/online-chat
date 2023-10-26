module.exports = function (io) {
    io.on('connection', socket => {
        socket.on('join-room', room => {
            socket.join(room);
            socket.on('chat-message', data => {
                io.to(room).emit('chat-message', {
                    message: data.message,
                    author: data.name
                });
            });
        });   
    });
}
