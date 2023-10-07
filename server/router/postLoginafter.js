const multer = require('multer');
const path = require('path');
const upload = multer({ dest: './data/image' });

module.exports = function (db, app, client) {
  app.post('/loginafter', upload.single('profileImage'), async function (req, res) {
    try {
      await client.connect();
      const action = req.body.action;

      if (action === 'fetchinfo') {
        // Existing code for fetching user information
      } else if (action === 'editUser') {
        const userId = Number(req.body.userId);
        const username = req.body.username;
        const email = req.body.email;
        console.log(username, email);

        if (req.file) {
          const fileName = req.file.filename;
          await db.collection('users').updateOne(
            { userid: userId },
            { $set: { username: username, email: email, filename: fileName } }
          );
        } else {
          await db.collection('users').updateOne(
            { userid: userId },
            { $set: { username: username, email: email } }
          );
        }

        if (result.modifiedCount === 1) {
          let user = await db.collection('users').findOne({ userid: userId })
          const responseData = {
            userid: user.userid,
            username: user.username,
            roles: user.roles,
            groups: user.groups,
            email: user.email
          };
  
          if (user.filename) {
            responseData.filename = user.filename;
          }
  
          res.send({
            valid: true,
            user: responseData
          });
        } else {
          res.send({ success: false });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  });
};
