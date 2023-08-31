var fs = require('fs');

module.exports = function(req, res) {
    var u = req.body.email;
    var p = req.body.pwd;
    fs.readFile('./data/users.json', 'utf8', function(err, data) {
        if (err) throw err;
        let userArray = JSON.parse(data);
        let user = userArray.find(user => user.email === u && user.password === p);
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
};
