var fs = require('fs');

module.exports = function (req, res) {
    const userId = req.body.userId; // Get the user ID from the request
    fs.readFile('./data/groups.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error reading groups data' });
            return;
        }
        try {
            const groupData = JSON.parse(data);

            // Filter groups where the user is a member or an admin
            // Filter groups where the user is a member or an admin
            const userGroups = groupData.filter(group => {
                const isMember = group.members.some(member => String(member.userid) === userId);
                const isAdmin = group.groupadmin.some(admin => String(admin.userid) === userId);
                return isMember || isAdmin;
            });
            // Extract group names
            const groupNames = userGroups.map(group => group.group);
            console.log(groupNames);
            res.json(groupNames);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).json({ error: 'Error parsing groups data' });
        }
    });
};
