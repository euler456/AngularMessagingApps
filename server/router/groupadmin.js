module.exports = function (db, app, client) {
  app.post('/groupadmin', async function (req, res) {
    await client.connect();
    if (!req.body) {
      return res.sendStatus(400);
    }
    const action = req.body.action;
    if (action === 'listGroups') {
      // Return the list of groups
      const groups = await db.collection('groups').find().toArray();
      res.send({ groups: groups });
    } else if (action === 'createGroup') {

      const groupName = req.body.group;
      const newGroup = {
        group: groupName,
        channels: []
      };
    const latestGroup = await db.collection('groups').find().sort({ groupid: -1 }).limit(1).toArray();
    let latestGroupId = 0;
    if (latestGroup.length > 0) {
      latestGroupId = latestGroup[0].groupid;
    }
    // Increment the latest user ID
    newGroup.groupid = latestGroupId + 1;
      const result = await db.collection('groups').insertOne(newGroup);
      if (result.insertedId) {
        res.send({ success: true });
      } else {
        res.send({ success: false, message: 'Failed to create a new group.' });
      }
    } else if (action === 'deleteGroup') {
      const groupId = Number(req.body.groupId);
    
      // Delete the group from the 'groups' collection
      const result = await db.collection('groups').deleteOne({ groupid: groupId });
    
      if (result.deletedCount === 1) {
        // Update all users who are members of this group
        const usersToUpdate = await db.collection('users').find({ groupid: groupId }).toArray();
        for (const user of usersToUpdate) {
          user.groupid = user.groupid.filter(id => id !== groupId);
          await db.collection('users').updateOne({ userid: user.userid }, { $set: { groupid: user.groupid } });
        }
    
        res.send({ success: true });
      } else {
        res.send({ success: false, message: 'Group not found.' });
      }
    }
     else if (action === 'createChannel') {
      const groupId = Number(req.body.groupId);
      const channelName = req.body.channelName;

      const result = await db.collection('groups').updateOne(
        { groupid: groupId },
        { $push: { channels: channelName } }
      );
      if (result.modifiedCount === 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false, message: 'Group or channel not found.' });
      }
    } else if (action === 'deleteChannel') {
      const groupId = Number(req.body.groupId);
      const channelName = req.body.channelName;

      const result = await db.collection('groups').updateOne(
        { groupid: groupId },
        { $pull: { channels: channelName } }
      );

      if (result.modifiedCount === 1) {
        res.send({ success: true });
      } else {
        res.send({ success: false, message: 'Group or channel not found.' });
      }
    }
    else if (action === 'joinGroup') {
      var userId = Number(req.body.userId);
      var groupId = Number(req.body.groupId);
    
      // Assuming you have a 'users' collection in your MongoDB
      const user = await db.collection('users').findOne({ userid: userId });
      const group = await db.collection('groups').findOne({ groupid: groupId });
    
      if (user && group) {
        // Check if the user is not already a member of the group
        if (!user.groupid) {
          user.groupid = []; // Initialize groupid array if it doesn't exist
        }
        if (!user.groupid.includes(groupId)) {
          user.groupid.push(groupId);
          await db.collection('users').updateOne({ userid: userId }, { $set: { groupid: user.groupid } });
          res.send({ success: true });
        } else {
          res.send({ success: false, message: 'User is already a member of the group.' });
        }
      } else {
        res.send({ success: false, message: 'User or group not found.' });
      }
    }
    else if (action === 'leaveGroup') {
      var userId = Number(req.body.userId);
      var groupId = Number(req.body.groupId);
    
      const user = await db.collection('users').findOne({ userid: userId });
      const group = await db.collection('groups').findOne({ groupid: groupId });
    
      if (user && group) {
        // Check if the user is a member of the group
        if (user.groupid && user.groupid.includes(groupId)) {
          user.groupid = user.groupid.filter(id => id !== groupId);
          await db.collection('users').updateOne({ userid: userId }, { $set: { groupid: user.groupid } });
          res.send({ success: true });
        } else {
          res.send({ success: false, message: 'User is not a member of the group.' });
        }
      } else {
        res.send({ success: false, message: 'User or group not found.' });
      }
    }
    client.close();
  });
};
