const express = require('express');

const conv = require('./Converter');


const app = express();
const port = process.env.PORT || 3000;

const state = {
    folder: __dirname + '/inputOutput',
    isRunning: false
};
const converter = new conv.Converter(state.folder);



app.use(express.static(__dirname + '/wwwroot'));

app.get('/onOff', (req, res) => {
    if (state.isRunning) {
        converter.stopTimer();
        state.isRunning = false;
        res.send(state);
    } else {
        converter.startTimer();
        state.isRunning = true;
        res.send(state);
    }
});

app.get('/getState', (req, res) => {
    res.send(state);
});

app.listen(port, () => {
    console.log('Started op port 3000');
});

app.post('/updateUrl', function (req, res) {
    res.send('POST request to homepage');
});