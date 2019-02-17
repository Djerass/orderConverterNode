const fs = require('fs');
const exec = require('child_process').execFile;


class ListFormatter {
    constructor(folder) {
        this.folder = folder;
        this.state = [];
    }
    start() {
        this.getListOfFiles()
            .then((files) => {
                const originalFiles = this.getOriginalFiles(files);
                this.state = [];
                originalFiles.forEach(originalFile => {
                    const completedFile = files.find((file => file === 'result' + originalFile));
                    if (completedFile) {
                        this.state.push({
                            originalFile,
                            completedFile
                        });
                    }
                });
                //console.log(this.getState());
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getListOfFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.folder, (err, files) => {
                if (err) reject(err);
                resolve(files);

            });
        });
    }
    getOriginalFiles(files) {
        const originalFiles = files.map((curr) => {
            if (!curr.startsWith('result') && !curr.startsWith('~$')) {
                return curr;
            }
        });
        return originalFiles;
    }
    startTimer() {
        this.interval = setInterval(() => {
            this.start();
        }, 1000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }
    removeFile(file){
        fs.unlink(this.folder + '/' + file,(err)=>{
            if (err){
                console.log(err);
            }
        });
        fs.unlink(this.folder+'/result'+file,(err)=>{
            if (err) console.log(err);;
        });
    }
    openFile(file){
        exec(this.folder + '/'+ file, (err)=>{
            if (err) console.log(err);
        });
        exec(this.folder + '/result'+ file, (err)=>{
            if (err) console.log(err);
        });        
    }
    getState() {
        return this.state;
    }
    changeFolder(newFolder){
        this.folder = newFolder;
    }

}


module.exports = {ListFormatter};

// const lf = new ListFormatter('/home/azariah/Desktop/xls/inputOutput');
// lf.start();
// setInterval(()=>{
//     console.log(lf.getState());
// }, 5000);