const fs = require('fs');



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
            this._start();
        }, 1000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }
    getState() {
        return this.state;
    }

}




const lf = new ListFormatter('/home/azariah/Desktop/xls/inputOutput');
//lf.start();
