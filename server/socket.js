module.exports = {
  connect: function(io, PORT) {
    const latestMessages = {};

    io.on('connection', (socket) => {
      socket.on('join', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
        const joinMessage = `${sender} has joined the channel.`;
      
        socket.join(channel);
        io.to(channel).emit('message', joinMessage);
      
        latestMessages[channel] = latestMessages[channel] || [];
        latestMessages[channel].push({ content: joinMessage, sender }); // Add join message to latest messages
      
        if (latestMessages[channel].length > 10) {
          latestMessages[channel].shift(); 
        }
        socket.emit('latestMessages', latestMessages[channel]);
      });
      

      socket.on('message', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
      
        if (!latestMessages[channel]) {
          latestMessages[channel] = [];
        }
      
        latestMessages[channel].push(messageData);
      
        if (latestMessages[channel].length > 10) {
          latestMessages[channel].shift();
        }
      
        io.to(channel).emit('message', messageData.content);
        socket.emit('latestMessages', latestMessages[channel]);
      });
      socket.on('image', async image => {
        const buffer = Buffer.from(image, 'base64');
        await fs.writeFile('/tmp/image', buffer).catch(console.error); // fs.promises
    });
      socket.on('leave', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
        const leaveMessage = `${sender} has left the channel.`;

        socket.leave(channel);
        io.to(channel).emit('message', leaveMessage);

        latestMessages[channel] = latestMessages[channel] || [];
        socket.emit('latestMessages', latestMessages[channel]);
      });
    });
  },
};
