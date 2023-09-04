var fs = require('fs');

module.exports = function (req, res) {
    const userId = Number(req.body.userId); // Get the user ID from the request

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

                // Find the user by their userid
                const user = users.find(user => user.userid === userId);
                console.log(user)
                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }

                // Extract group IDs from the user data
                const groupIds = user.groupid || [];
                // Find the corresponding group names using groupIds
                const userGroups = groupIds.map(groupId => {
                    const group = groups.find(group => group.groupid === groupId);
                    return group ? { groupid: group.groupid, group: group.group } : null;
                }).filter(Boolean);
                console.log(userGroups)
                res.json(userGroups);
            } catch (parseError) {
                console.error(parseError);
                res.status(500).json({ error: 'Error parsing data' });
            }
        });
    });
};
