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
app.use('/images',express.static(path.join(__dirname , './userimages')));

  // Define your REST API routes
  require('./router/postLogin.js')(db, app, client);
  require('./router/postLoginafter')(db, app, client);
  require('./router/superadmin')(db, app, client);
  require('./router/chat')(db, app, client);
  require('./router/groupadmin')(db, app, client);
  require('./listen.js')(http,PORT);

// Socket.io setup
sockets.connect(io, PORT);

module.exports = app;