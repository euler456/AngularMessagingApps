const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /loginafter', function () {
  it('should return user groups with valid user ID', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 4 }) // Assuming userId 4 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.forEach(group => {
          group.should.have.property('group');
          group.should.have.property('channels');
          group.should.have.property('users');
        });
        done();
      });
  });

  it('should handle user not found error', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 999 }) // Assuming user with userId 999 does not exist
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error').eql('User not found');
        done();
      });
  });

  it('should handle invalid input data', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({}) // No userId provided
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error').eql('Invalid input data');
        done();
      });
  });

  it('should return user details along with groups', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 1 }) // Assuming userId 1 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('user');
        res.body.should.have.property('groups');
        res.body.user.should.have.property('userId').eql(1);
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('email');
        res.body.groups.should.be.an('array');
        done();
      });
  });

  // Add more test cases as needed...

  it('should handle a server error', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 2 }) // Assuming userId 2 exists but triggers a server error
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.have.property('error').eql('Server error');
        done();
      });
  });
});
