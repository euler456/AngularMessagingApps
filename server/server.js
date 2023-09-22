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

const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://127.0.0.1:27017/";
const bodyParser = require('body-parser');
const path = require('path');
const sockets = require('./socket.js');
const server = require('./listen.js');
const PORT = 3000;
const dbName = 'ChatDatabase';

const {MongoClient} = require('mongodb'),
client = new MongoClient('mongodb://127.0.0.1:27017/');

const db = client.db(dbName);
// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

  // require('./router/api-add.js')(db);
  // Define your REST API routes
  require('./router/postLogin.js')(db, app, client);
  // app.post('/loginafter', require('./router/postLoginafter'));
  // app.post('/superadmin', require('./router/superadmin'));
  // app.post('/chat', require('./router/chat'));
  // app.post('/groupadmin', require('./router/groupadmin'));
  require('./listen.js')(http,PORT);

// Socket.io setup
sockets.connect(io, PORT);

// Start the Express server
