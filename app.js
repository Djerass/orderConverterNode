const express = require('express');
const bodyParser = require('body-parser');
const conv = require('./Converter');
const list = require('./ListFormatter');

const app = express();
const port = process.env.PORT || 3000;

const state = {
    folder: __dirname + '/inputOutput',
    files: [],
    isRunning: false
};
const converter = new conv.Converter(state.folder);
const listGet  = new list.ListFormatter(state.folder);


app.use(express.static(__dirname + '/wwwroot'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/onOff', (req, res) => {
    if (state.isRunning) {
        converter.stopTimer();
        listGet.stopTimer();
        state.isRunning = false;
        res.send(state);
    } else {
        converter.startTimer();
        listGet.startTimer();
        state.isRunning = true;
        res.send(state);
    }
});

app.get('/getState', (req, res) => {
    state.files = listGet.getState();
    res.send(state);
});

app.post('/updateUrl',  (req, res) => {
    const path = req.body.path;
    converter.changeFolder(path);
    state.folder = path;
    const message = `Folder swaped to ${path}`;
    console.log(message);
    res.send({ message });   
});

app.delete('/deleteFile',  (req, res)=>{{
    const file = req.body.file;
    console.log(file);
    listGet.removeFile(file);
    const message = `File ${file} removed`;
    console.log(message);
    res.send({ message });  
}});
app.post('/openFile', (req,res)=>{
    const file = req.body.file;
    console.log(file);
    listGet.openFile(file);
    const message = `File ${file} opened`;
    console.log(message);
    res.send({ message });
});
    


app.listen(port, () => {
    console.log('Started op port 3000');
});

