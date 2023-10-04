module.exports = {
  connect: function(io, PORT) {
    io.on('connection', (socket) => {
      socket.on('join', (channelName) => {
        socket.join(channelName);
        // Emit a message indicating that a user has joined the channel
        const joinMessage = `${socket.id} has joined the channel.`;
        io.to(channelName).emit('message', joinMessage);
      });
      socket.on('message', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        socket.join(channel);
        console.log(channel);
        io.to(channel).emit('message', messageData.content);
      });
      
      socket.on('leave', (channelName) => {
        const leaveMessage = `${socket.id} has leaved the channel.`;
        io.to(channelName).emit('message', leaveMessage);
        socket.leave(channelName);
      });
    });
  },
};
