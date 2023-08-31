const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '/../dist/week4tut')));

console.log(__dirname);

app.listen(3000, "localhost", function() {
    var d = new Date();
    var n = d.getHours();
    var m = d.getMinutes();

    console.log(`Server has been started at: ${n}:${m}`);
});
// Use the authRouter for handling authentication routes
app.post('/login', require('./router/postLogin'));
app.post('/loginafter', require('./router/postLoginafter'));

