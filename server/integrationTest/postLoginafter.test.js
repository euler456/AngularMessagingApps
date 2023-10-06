const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

describe('POST /loginafter', function() {
  it('should return user groups with valid user ID', (done) => {
    chai.request(app)
      .post('/loginafter')
      .send({ userId: 4 }) // Assuming userId 1 exists
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

 
});
