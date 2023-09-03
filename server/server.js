const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

const bodyParser = require('body-parser');
const path = require('path');
const sockets = require('./socket.js');
const server = require('./listen.js');
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the dist directory (assuming your Angular app is built there)
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

// Define your REST API routes
app.post('/login', require('./router/postLogin'));
app.post('/loginafter', require('./router/postLoginafter'));
app.post('/superadmin', require('./router/superadmin'));

// Socket.io setup
sockets.connect(io, PORT);

// Start the Express server
server.listen(http, PORT, () => {
  const d = new Date();
  const n = d.getHours();
  const m = d.getMinutes();
  console.log(`Server has been started at: ${n}:${m}`);
});
