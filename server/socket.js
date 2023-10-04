module.exports = {
  connect: function(io, PORT) {
    io.on('connection', (socket) => {
      console.log('user connection on port' + PORT + ':' + socket.id);

      socket.on('message', (data) => {
        const messageData = JSON.parse(data);
        io.emit('message', messageData.sender + ':' + messageData.content);
      });

      socket.on('join', (channelName) => {
        socket.join(channelName);
        const messageData = {
          content: `A user has joined ${channelName}.`,
          sender: 'System',
        };
        io.to(channelName).emit('message', JSON.stringify(messageData));
      });

      socket.on('leave', (channelName) => {
        socket.leave(channelName);
        const messageData = {
          content: `A user has left ${channelName}.`,
          sender: 'System',
        };
        io.to(channelName).emit('message', JSON.stringify(messageData));
      });
    });
  },
};
