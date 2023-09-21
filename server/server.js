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
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://127.0.0.1:27017/";
const bodyParser = require('body-parser');
const path = require('path');
const sockets = require('./socket.js');
const server = require('./listen.js');
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));
const dbName = 'ChatDatabase';
console.log("Request received in server.js");

MongoClient.connect(url, function(err, client) {
  console.log("Request received in server.js");

  if (err) return console.log(err);
  const db = client.db(dbName);
  require('./router/api-add.js')(db);
  // Define your REST API routes
  console.log("Request received in server.js");

  app.post('/login', require('./router/postLogin.js')(db, app));
  // app.post('/loginafter', require('./router/postLoginafter'));
  // app.post('/superadmin', require('./router/superadmin'));
  // app.post('/chat', require('./router/chat'));
  // app.post('/groupadmin', require('./router/groupadmin'));
  require('./listen.js')(http);
});

// Socket.io setup
sockets.connect(io, PORT);

// Start the Express server
server.listen(http, PORT, () => {
  const d = new Date();
  const n = d.getHours();
  const m = d.getMinutes();
  console.log(`Server has been started at: ${n}:${m}`);
});
