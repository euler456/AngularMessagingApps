const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /superadmin', function() {
  it('should fetch all users', (done) => {
    chai.request(app)
      .post('/superadmin')
      .send({ action: 'fetchUsers' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('users');
        res.body.users.should.be.a('array');
        done();
      });
  });

  it('should create a new user', (done) => {
    chai.request(app)
      .post('/superadmin')
      .send({
        action: 'createUser',
        user: {
          username: 'user8',
          email: 'user8@example.com',
          password: 'password123',
          roles: ['user'],
        }
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });

  it('should delete an existing user', (done) => {
    chai.request(app)
      .post('/superadmin')
      .send({ action: 'deleteUser', userId: 7 }) // Assuming user with userId 1 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });


  it('should handle user not found error when deleting user', (done) => {
    chai.request(app)
      .post('/superadmin')
      .send({ action: 'deleteUser', userId: 999 }) // Assuming user with userId 999 does not exist
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(false);
        res.body.should.have.property('message').eql('User not found.');
        done();
      });
  });


});
