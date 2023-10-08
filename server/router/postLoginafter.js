module.exports = function (db, app, client) {
  app.post('/loginafter', async function (req, res) {
    try {
      await client.connect();
      const action = req.body.action;
      console.log(req.body);
      if (action === 'fetchinfo') {
        const userId = Number(req.body.userId);
        const usersCollection = db.collection('users');
        const groupsCollection = db.collection('groups');
        const user = await usersCollection.findOne({ userid: userId });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const groupIds = user.groupid || [];
        const userGroups = await groupsCollection
            .find({ groupid: { $in: groupIds } })
            .toArray();
        res.json(userGroups);
        } else if (action === 'editUser') {
        const userId = Number(req.body.userId);
        const username = req.body.username;
        const email = req.body.email;
        const result = await db.collection('users').updateOne(
            { userid: userId },
            { $set: { username: username, email: email } }
          );
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
