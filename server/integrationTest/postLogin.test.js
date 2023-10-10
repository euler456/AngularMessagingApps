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
