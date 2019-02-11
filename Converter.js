const fs = require('fs');
const XLSX = require('xlsx');
class Converter {
    constructor(folder) {
        this.folder = folder;
        this._interval;
    }
    changeFolder(newFolder) {
        this.folder = newFolder;
    }

    _start() {
        this.getListOfFiles().then((files) => {
                return this._getFilesToConvert(files);
            }).then((files) => {
                for (let file of files) {
                    try {
                        this._convert(file);
                    } catch (e) {
                        console.log(e);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            });
    }

    getListOfFiles() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.folder, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
    _getFilesToConvert(allFiles) {
        return new Promise((resolve, reject) => {
            const filesToConvert = [];
            for (let file of allFiles) {
                if (this._needToConvert(file, allFiles)) {
                    filesToConvert.push(file);
                }
            }
            resolve(filesToConvert);
        });

    }

    // Check if file in excel format
    // Check if file is result file or temp file
    // Check if file is already converted
    _needToConvert(file, allFiles) {
        if (file.endsWith('.xls') || file.endsWith('.xlsx')) {
            if (file.startsWith('result') || file.startsWith('~$')) {
                return false;
            } else if (this._isAlreadyConverted(file, allFiles)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    //Check if there is result file in folder
    _isAlreadyConverted(file, allFiles) {
        let flag = false;
        for (let fl of allFiles) {
            if (fl !== file && !fl.startsWith('~$') && fl.endsWith(file)) {
                flag = true;
            }
        }
        return flag;
    }

    _convert(file) {
        const workbook = XLSX.readFile(this.folder + '/' + file);
        let products = [];
        for (let sheetName of workbook.SheetNames) {
            // Define start position = 20 and exitCounter = 0
            // Start iterations
            // for each iteration
            // if cell of article is empty - exitCounter is increment on 1 -
            // if exitCounter === 4 - break iterations move to next page
            // else if exitCounter < 4 move to next row
            // if cell of article is not empty - exitCounter become 0
            // if cell of number is empty move to next row else save
            const sheet = workbook.Sheets[sheetName];
            const sheetProduct = this._get_data(sheet);
            products = products.concat(sheetProduct);
        }

        this.write_file(file, products);

    }

    _get_data(sheet){
        const resultData = [];
        let position = 20;
        let exitCounter = 0;
        while (true) {
            const articleCell = sheet[`B${position}`];
            const nameCell = sheet[`A${position}`];
            const numberCell = sheet[`E${position}`];
            if (articleCell) {
                exitCounter = 0;
                if (numberCell) {
                    const object = [
                        nameCell.v,
                        articleCell.v,
                        '',
                        '',
                        numberCell.v
                    ];
                    resultData.push(object);
                }
            } else {
                exitCounter++;
                if (exitCounter === 4) {
                    break;
                }
            }
            position++;
        }
        return resultData;
    }

    
    write_file(file, data) {
        const wb = XLSX.utils.book_new();
        wb.SheetNames.push("result");
        const ws = XLSX.utils.aoa_to_sheet(data);
        wb.Sheets["result"] = ws;
        const resultFileName = this.folder + '/' + 'result' + file;
        XLSX.writeFile(wb, resultFileName);
    }

    startTimer() {
        this.interval = setInterval(() => {
            console.log(new Date().toString());
            this._start();
        }, 3000);
    }
    stopTimer() {
        clearInterval(this.interval);
    }
}