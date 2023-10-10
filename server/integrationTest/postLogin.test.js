const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /login', function() {
  it('should return user data with valid email', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'admin@gmail.com', pwd: '123' }) // Example input: valid email and password
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('valid').eql(true);
        res.body.should.have.property('user');
        res.body.user.should.have.property('userid');
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('roles');
        done();
      });
  });

  it('should return valid as false with invalid email or password', (done) => {
    chai.request(app)
      .post('/login')
      .send({ email: 'invalid@example.com', pwd: '123' }) // Example input: invalid email and password
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('valid').eql(false);
        done();
      });
  });

  it('should handle missing request body', (done) => {
    chai.request(app)
      .post('/login')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

 
});

  it('should return user groups ', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 1}) 
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
      .send({ action:"fetchinfo",userId: 1 }) // Assuming user with userId 999 does not exist
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
      .send({  action:"editUser" ,userId: 1 ,username:"user1",email:"abc@gmail.com" }) // Assuming userId 1 exists
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.user.should.have.property('userId').eql(1);
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('email');
        done();
      });
  });

