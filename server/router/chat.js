module.exports = function (db, app, client) {
    app.post('/chat', async function (req, res) {
      await client.connect();
      const groupId = Number(req.body.groupId); // Get the groupId from the frontend

      try {
        const groupsCollection = db.collection('groups');

        const usersCollection = db.collection('users');

        const group = await groupsCollection.findOne({ groupid: groupId });

        if (!group) {
          res.status(404).json({ error: 'Group not found' });
          return;
        }
  
        const usersInGroup = await usersCollection.find({ groupid: groupId }).toArray();

        const usernames = usersInGroup.map(user => user.username);
  
        res.json({
          group: group.group,
          channels: group.channels,
          users: usernames
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  };
  