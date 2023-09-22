
module.exports = function (db, app,client) {
    app.post('/loginafter', async function (req, res) {
        try {
            // Connect to MongoDB
            await client.connect();

            const userId = Number(req.body.userId);

            // Get a reference to the database
            // Get references to the user and group collections
            const usersCollection = db.collection('users');
            const groupsCollection = db.collection('groups');

            // Find the user by their userId
            const user = await usersCollection.findOne({ userid: userId });

            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Extract group IDs from the user data
            const groupIds = user.groupid || [];

            // Find the corresponding group names using groupIds
            const userGroups = await groupsCollection
                .find({ groupid: { $in: groupIds } })
                .toArray();

            res.json(userGroups);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        } finally {
            // Close the MongoDB connection
            await client.close();
        }
    });
};
