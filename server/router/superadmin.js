module.exports = function (db, app, client) {
    app.post('/superadmin', async function (req, res) {
      await client.connect();
      if (!req.body) {
        return res.sendStatus(400);
      }
      const action = req.body.action;
      if (action === 'fetchUsers') {
        // Return the list of users
        const users = await db.collection('users').find().toArray();
        res.send({ users: users });
      } else if (action === 'createUser') {
        // Create a new user
        const newUser = req.body.user;
        const latestUser = await db.collection('users').find().sort({ userid: -1 }).limit(1).toArray();
        let latestUserId = 0;
        if (latestUser.length > 0) {
          latestUserId = latestUser[0].userid;
        }
        // Increment the latest user ID
        newUser.userid = latestUserId + 1;
        if (!await isUserUnique(newUser.username, newUser.email, db)) {
          res.send({ success: false, message: 'Username or email already exists.' });
        } else {
          const result = await db.collection('users').insertOne(newUser);
          if (result.insertedId) {
            res.send({ success: true });
          } else {
            res.send({ success: false, message: 'Failed to create a new user.' });
          }
        }
      } else if (action === 'deleteUser') {
        // Delete a user
        const userId = Number(req.body.userId);
        const result = await db.collection('users').deleteOne({ userid: userId });
        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.send({ success: false, message: 'User not found.' });
        }
      } else if (action === 'changeUserRole') {
        // Change user role (superadmin, groupadmin, user)
        const userId = Number(req.body.userId);
        const newRole = req.body.newRole;
        const result = await db.collection('users').updateOne(
          { userid: userId },
          { $set: { roles: newRole } }
        );
  
        if (result.modifiedCount === 1) {
          res.send({ success: true });
        } else {
          res.send({ success: false });
        }
      }
      // Add more actions as needed.
  
      client.close();
    });
  };
  
  async function isUserUnique(username, email, db) {
    const existingUser = await db.collection('users').findOne({ $or: [{ username: username }, { email: email }] });
    return !existingUser;
  }
  