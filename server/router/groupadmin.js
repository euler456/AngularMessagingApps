var fs = require('fs');

module.exports = function (req, res) {
    var action = req.body.action;
    var groups = readGroupsFile();
    var users = readUsersFile();

    if (action === 'listGroups') {
        // Return the list of groups
        console.log(groups);
        res.send({ groups: groups });
    } else if (action === 'createGroup') {
        var groupName = req.body.group;
        var newGroupId = generateGroupId(groups);
        var newGroup = {
          groupid: newGroupId,
          group: groupName,
          channels: []
        };
        groups.push(newGroup);
        writeGroupsFile(groups);
        res.send({ success: true });
      }
      else if (action === 'deleteGroup') {
        // Delete a group
        var groupId = Number(req.body.groupId);
        groups = groups.filter(group => group.groupid !== groupId);
        writeGroupsFile(groups);
        res.send({ success: true });
    } else if (action === 'createChannel') {
        // Create a new channel in a group
        var groupId = Number(req.body.groupId);
        var channelName = req.body.channelName;
        var group = groups.find(group => group.groupid === groupId);
        if (group) {
            group.channels.push(channelName);
            writeGroupsFile(groups);
            res.send({ success: true });
        } else {
            res.send({ success: false, message: 'Group not found.' });
        }
    } else if (action === 'deleteChannel') {
        // Delete a channel from a group
        var groupId = Number(req.body.groupId);
        var channelName = req.body.channelName;
        var group = groups.find(group => group.groupid === groupId);
        if (group) {
            group.channels = group.channels.filter(channel => channel !== channelName);
            writeGroupsFile(groups);
            res.send({ success: true });
        } else {
            res.send({ success: false, message: 'Group not found.' });
        }
    }
    else if (action === 'joinGroup') {
        var userId = Number(req.body.userId);
        var groupId = Number(req.body.groupId);
        var user = users.find(user => user.userid === userId);
        var group = groups.find(group => group.groupid === groupId);
        if (user && group) {
          // Check if the user is not already a member of the group
          if (!user.groupid) {
            user.groupid = []; // Initialize groupid array if it doesn't exist
          }
          if (!user.groupid.includes(groupId)) {
            user.groupid.push(groupId);
            writeUsersFile(users);
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
        var user = users.find(user => user.userid === userId);
        var group = groups.find(group => group.groupid === groupId);
        if (user && group) {
          // Check if the user is a member of the group
          if (user.groupid && user.groupid.includes(groupId)) {
            user.groupid = user.groupid.filter(id => id !== groupId);
            writeUsersFile(users);
            res.send({ success: true });
          } else {
            res.send({ success: false, message: 'User is not a member of the group.' });
          }
        } else {
          res.send({ success: false, message: 'User or group not found.' });
        }
      }
}
      

function readGroupsFile() {
    try {
        var data = fs.readFileSync('./data/groups.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading groups file:', err);
        return [];
    }
}

function writeGroupsFile(groups) {
    try {
        fs.writeFileSync('./data/groups.json', JSON.stringify(groups, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing groups file:', err);
    }
}
function readUsersFile() {
    try {
        var data = fs.readFileSync('./data/users.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
}

function writeUsersFile(users) {
    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing users file:', err);
    }
}

function generateGroupId(groups) {
    var maxId = 0;
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].groupid > maxId) {
            maxId = groups[i].groupid;
        }
    }
    return maxId + 1;
}
