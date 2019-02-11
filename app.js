const express = require('express');

const conv = require('./Converter');


const app = express();
const port = process.env.PORT || 3000;

const converter = new conv.Converter(__dirname+'/inputOutput');

app.use(express.static(__dirname + '/wwwroot'));

app.get('/start', (req, res) => {
    converter.startTimer();
    res.send({result:'start'});
});

app.get('/stop', (req, res) => {
    converter.stopTimer();
    res.send({result:'stop'});
});


app.listen(port, () => {
    console.log('Started op port 3000');
});