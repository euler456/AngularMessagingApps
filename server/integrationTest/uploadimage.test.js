const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

chai.use(chaiHttp);

describe('POST /profileImage', function() {
  it('should upload a profile image and update user record', (done) => {
    const userId = 1; // Replace with a valid userId for your test case
    const filePath = path.join(__dirname, 'test-image.jpg'); // Replace with the path of a test image

    chai.request(app)
      .post('/profileImage')
      .field('userId', userId)
      .attach('image', fs.readFileSync(filePath), 'test-image.jpg')
      .end(async (err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('valid').eql(true);
        res.body.should.have.property('user');
        res.body.user.should.have.property('userid').eql(userId);
        res.body.user.should.have.property('username');
        res.body.user.should.have.property('roles');
        res.body.user.should.have.property('filename').eql('test-image.jpg');
        res.body.should.have.property('data');
        res.body.data.should.have.property('filename').eql('test-image.jpg');
        res.body.data.should.have.property('size'); // Assuming you want to check the size
        
        // Check if the file has been properly saved on the server
        const fileExists = fs.existsSync(path.join(__dirname, "../image/test-image.jpg"));
        fileExists.should.equal(true);

        // Check if the user record in the database has been updated
        const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
        const db = client.db('your_database_name'); // Replace with your database name
        const user = await db.collection('users').findOne({ userid: userId });
        user.should.have.property('filename').eql('test-image.jpg');
        
        // Clean up: remove the test image file
        fs.unlinkSync(path.join(__dirname, "../image/test-image.jpg"));
        
        // Clean up: reset the user's filename in the database
        await db.collection('users').updateOne(
          { userid: userId },
          { $unset: { filename: '' } }
        );

        // Clean up: close the MongoDB connection
        await client.close();

        done();
      });
  });

  it('should handle invalid user ID', (done) => {
    chai.request(app)
      .post('/profileImage')
      .field('userId', 'invalidUserId') // Invalid user ID
      .attach('image', fs.readFileSync(path.join(__dirname, 'test-image.jpg')), 'test-image.jpg')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql('Fail');
        res.body.should.have.property('message').eql('Invalid user ID');
        done();
      });
  });

  it('should handle invalid file format', (done) => {
    chai.request(app)
      .post('/profileImage')
      .field('userId', 1)
      .attach('image', fs.readFileSync(path.join(__dirname, 'invalid-format.txt')), 'invalid-format.txt') // Invalid file format
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql('Fail');
        res.body.should.have.property('message').eql('Invalid file format');
        done();
      });
  });

  it('should handle file parsing error', (done) => {
    chai.request(app)
      .post('/profileImage')
      .field('userId', 1)
      .attach('invalidFieldName', fs.readFileSync(path.join(__dirname, 'test-image.jpg')), 'test-image.jpg') // Invalid field name
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql('Fail');
        res.body.should.have.property('message').eql('Error parsing the files');
        done();
      });
  });
});