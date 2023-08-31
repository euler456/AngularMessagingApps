var fs = require('fs');

module.exports = function (req, res) {
    const groupId = req.body.groupID; // Get the group ID from the request
    console.log(groupId)
    fs.readFile('./data/users.json', 'utf8', function (err, data) {
        if (err) throw err;
        let userArray = JSON.parse(data);
        // Filter user objects based on the provided group ID
        const matchingUsers = userArray.filter(user => user.groups === groupId
            );
        // Extract usernames from the matching user objects
        const usernames = matchingUsers.map(user => user.username);
        console.log(usernames);
        res.send(usernames);

    });
};
