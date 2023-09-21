module.exports = function(db, app) {
    app.post('/login', function(req, res) {
        if (!req.body) {
            return res.sendStatus(400);
          }
        const u = req.body.email;
        const p = req.body.pwd;
        console.log("Request received in login.js");

        db.collection('users').findOne({ email: u, password: p }, function(err, user) {
            if (err) throw err;
            if (user) {
                res.send({
                    valid: true,
                    user: {
                        userid: user.userid,
                        username: user.username,
                        roles: user.roles,
                        groups: user.groups,
                        email: user.email
                    }
                });
            } else {
                res.send({ valid: false });
            }
        });
    });
};
