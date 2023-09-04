const fs = require('fs');

module.exports = function (req, res) {
    const groupId = Number(req.body.groupId); // Get the groupId from the frontend

    // Read the user and group data
    fs.readFile('./data/users.json', 'utf8', function (userErr, userData) {
        if (userErr) {
            console.error(userErr);
            res.status(500).json({ error: 'Error reading user data' });
            return;
        }

        fs.readFile('./data/groups.json', 'utf8', function (groupErr, groupData) {
            if (groupErr) {
                console.error(groupErr);
                res.status(500).json({ error: 'Error reading groups data' });
                return;
            }

            try {
                const users = JSON.parse(userData);
                const groups = JSON.parse(groupData);

                // Find the group by groupId
                const group = groups.find(group => Number(group.groupid) === groupId);

                if (!group) {
                    res.status(404).json({ error: 'Group not found' });
                    return;
                }

                // Find the users in the group
                const usersInGroup = users.filter(user => {
                    return user.groupid && user.groupid.includes(groupId);
                });

                // Extract usernames from users in the group
                const usernames = usersInGroup.map(user => user.username);
                res.json({
                    group: group.group,
                    channels: group.channels,
                    users: usernames
                });
            } catch (parseError) {
                console.error(parseError);
                res.status(500).json({ error: 'Error parsing data' });
            }
        });
    });
};
