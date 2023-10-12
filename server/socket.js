module.exports = {
  connect: function(io, PORT) {
    const latestMessages = {};
    const fs = require('fs').promises;

    io.on('connection', (socket) => {
      socket.on('join', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
        const joinMessage = `${sender} has joined the channel.`;
    
        const joinMessageData = {
          content: joinMessage,
          sender: sender,
          channel: channel
        };
    
        socket.join(channel);
        io.to(channel).emit('message', joinMessageData);
    
        latestMessages[channel] = latestMessages[channel] || [];
    
        if (latestMessages[channel].length > 10) {
          latestMessages[channel].shift();
        }
        socket.emit('latestMessages', latestMessages[channel]);
        latestMessages[channel].push(joinMessageData); // Add join message to latest messages

      });
      

      socket.on('message', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
      
        if (!latestMessages[channel]) {
          latestMessages[channel] = [];
        }
      
        if (latestMessages[channel].length > 10) {
          latestMessages[channel].shift();
        }

        io.to(channel).emit('message', messageData);
        socket.emit('latestMessages', latestMessages[channel]);
        latestMessages[channel].push(messageData);
        console.log(latestMessages[channel]);

      });

      socket.on('image', async (image) => {
        const messageData = JSON.parse(image);
        const channel = messageData.channel;
        const sender = messageData.sender;
        
        // Emit the image message to all clients in the channel
        io.to(channel).emit('image', messageData);
        // You can also emit the updated latest messages
        socket.emit('latestMessages', latestMessages[channel]);
        latestMessages[channel].push(messageData);

      });
      
      socket.on('leave', (data) => {
        const messageData = JSON.parse(data);
        const channel = messageData.channel;
        const sender = messageData.sender;
        const leaveMessage = `${sender} has left the channel.`;
        const leaveMessageData = {
          content: leaveMessage,
          sender: sender,
          channel: channel
        };
        latestMessages[channel] = latestMessages[channel] || [];

        io.to(channel).emit('message', leaveMessageData);

        socket.emit('latestMessages', latestMessages[channel]);

        latestMessages[channel].push(leaveMessageData);
        console.log(latestMessages[channel]);
        socket.leave(channel);
      });
    });
  },
};
