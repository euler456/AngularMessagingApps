const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /chat', function() {
  it('should return group data with valid group ID', (done) => {
    chai.request(app)
      .post('/chat')
      .send({ groupId: 1 }) 
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('group');
        res.body.should.have.property('channels');
        res.body.should.have.property('users');
        done();
      });
  });
  it('should handle invalid input error', (done) => {
    chai.request(app)
      .post('/chat')
      .send({ groupId: 'invalid' }) // Sending an invalid groupId to trigger an error
      .end((err, res) => {
        res.should.have.status(404); // Expecting a 500 Internal Server Error
        res.body.should.have.property('error'); // Expecting an error message in the response body
        done();
      });
  });
});
