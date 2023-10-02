module.exports = {
  connect: function(io, PORT) {
    io.on('connection', (socket) => {
      console.log('user connection on port' + PORT + ':' + socket.id);
      socket.on('message', (data) => {
        // Assuming data includes both the message content and the channel name
        const channel = data.channel;
        io.to(channel).emit('message', data.content);
      });
    });
  },
};
