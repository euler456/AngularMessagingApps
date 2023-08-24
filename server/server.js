var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const authRouter = require('./auth'); // Adjust the path as needed

app.use(bodyParser.json());
app.use(express.static(__dirname + '/www'));

// Use the authRouter for handling authentication routes
app.use(authRouter);

app.listen(3000, () => {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();
    console.log("Server has been started at: " + n + " : " + m);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/www/form.html');
});
