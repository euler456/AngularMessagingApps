const request = require('supertest');
const assert = require('assert');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const path = require('path');
const sockets = require('../socket.js');
const server = require('../listen.js');
const PORT = 3000;
const dbName = 'ChatDatabase';

const { MongoClient } = require('mongodb'),
  client = new MongoClient('mongodb://127.0.0.1:27017/');

const db = client.db(dbName);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

// Define your REST API routes
require('../router/postLogin.js')(db, app, client);
require('../router/postLoginafter')(db, app, client);
require('../router/superadmin')(db, app, client);
require('../router/chat')(db, app, client);
require('../router/groupadmin')(db, app, client);
require('../listen.js')(http, PORT);

// Socket.io setup
sockets.connect(io, PORT);
// Assuming you have a route defined like this in your server code:
app.get('/', function(req, res) {
    res.status(200).send('Hello World');
  });
  
  // In your test file:
  describe('Server Routes', function () {
    it('should return 200 OK for GET /', function (done) {
      request(app)
        .get('/')
        .expect(200, done);
    });
  });
  

