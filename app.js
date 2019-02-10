if (typeof require !== 'undefined') XLSX = require('xlsx');
const workbook = XLSX.readFile('ИП Нагоричный_12.02.2019.xls');
const products = [];
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
                products.push(object);
            }
        } else {
            exitCounter++;
            if (exitCounter === 4) {
                break;
            }
        }
        position++;
    }
}

const wb = XLSX.utils.book_new();
wb.SheetNames.push("result");
const ws = XLSX.utils.aoa_to_sheet(products);
wb.Sheets["result"] = ws;
XLSX.writeFile(wb, 'out.xls');