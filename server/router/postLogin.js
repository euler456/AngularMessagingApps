var fs = require('fs');

module.exports = function(req, res) {
    var u = req.body.username;
    var p = req.body.pwd;
    fs.readFile('./data/users.json', 'utf8', function(err, data) {
        if (err) throw err;
        let userArray = JSON.parse(data);
        let user = userArray.find(user => user.email === u && user.password === p);
        if (user) {
            res.send({
                valid: true,
                user: {
                    username: user.username,
                    birthdate: user.birthdate,
                    age: user.age,
                    email: user.email
                }
            });
        } else {
            res.send({ valid: false });
        }
    });
};
