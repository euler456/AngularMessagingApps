var fs = require('fs');

module.exports = function (req, res) {
    var action = req.body.action;
    var users = readUsersFile();

    if (action === 'listUsers' || action === 'fetchUsers') {
        // Return the list of users
        res.send({ users: users });
    } else if (action === 'createUser') {
        // Create a new user
        var newUser = req.body.user;
        newUser.userid = generateUserId(users);
        users.push(newUser);
        writeUsersFile(users);
        res.send({ success: true });
    } else if (action === 'deleteUser') {
        // Delete a user
        var userId = Number(req.body.userId); // Convert userId to a number
        console.log(userId);
        users = users.filter(user => user.userid !== userId);
        writeUsersFile(users);
        res.send({ success: true });
    } else if (action === 'changeUserRole') {
        // Change user role (superadmin, groupadmin, user)
        var userId = Number(req.body.userId);
        var newRole = req.body.newRole;
        console.log(newRole)
        var user = users.find(user => user.userid === userId);
        if (user) {
            user.roles = newRole;
            writeUsersFile(users);
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    }
};

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

function generateUserId(users) {
    var maxId = 0;
    for (var i = 3; i < users.length; i++) {
        if (users[i].userid > maxId) {
            maxId = users[i].userid;
        }
    }
    return maxId + 1;
}
