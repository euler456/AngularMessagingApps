const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /groupadmin', function() {
  it('should create a new group', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'createGroup', group: 'Test Group' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should delete an existing group', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'deleteGroup', groupId: 3 }) // Assuming groupId 1 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should create a new channel in a group', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'createChannel', groupId: 1, channelName: 'Test Channel' }) // Assuming groupId 1 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should delete a channel from a group', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'deleteChannel', groupId: 1, channelName: 'Test Channel' }) // Assuming groupId 1 and channel 'Test Channel' exist
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should join a user to a group', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'joinGroup', userId: 1, groupId: 1 }) // Assuming userId 1 and groupId 1 exist
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should leave a group for a user', (done) => {
    chai.request(app)
      .post('/groupadmin')
      .send({ action: 'leaveGroup', userId: 4, groupId: 1 }) // Assuming userId 1 and groupId 1 exist
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

});
