const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const socketModule = require('../socket.js');

chai.use(chaiHttp);
const should = chai.should();

// Start server
http.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Connect socket
socketModule.connect(io, 3000);

describe('Socket Module', function() {
  describe('Join Channel', function() {
    it('should join a channel and emit a join message', (done) => {
      chai.request(app)
        .post('/join')
        .send({ channel: 'testChannel', sender: 'TestUser' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('TestUser has joined the channel.');
          done();
        });
    });
  });

  describe('Send Message', function() {
    it('should send a message to a channel', (done) => {
      chai.request(app)
        .post('/message')
        .send({ channel: 'testChannel', sender: 'TestUser', content: 'Hello, World!' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Hello, World!');
          done();
        });
    });
  });

  describe('Send Image', function() {
    it('should send an image to a channel', (done) => {
      chai.request(app)
        .post('/image')
        .send({ channel: 'testChannel', sender: 'TestUser', content: 'base64encodedImage' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('content').eql('base64encodedImage');
          done();
        });
    });
  });

  describe('Leave Channel', function() {
    it('should leave a channel and emit a leave message', (done) => {
      chai.request(app)
        .post('/leave')
        .send({ channel: 'testChannel', sender: 'TestUser' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('TestUser has left the channel.');
          done();
        });
    });
  });
});
