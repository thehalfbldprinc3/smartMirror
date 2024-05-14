const {Ocr} = require("node-ts-ocr");
// import * as path from 'path';
const path = require("path");
 
async function getPdfText(fileName: string): Promise<string> {
    // Assuming your file resides in a directory named sample
    const relativePath = path.join('/pdfs/', fileName);
    const pdfPath = path.join(__dirname, relativePath);
    console.log(pdfPath);
    // Extract the text and return the result
    return await Ocr.extractText(pdfPath);
}

getPdfText("noticemqcouncellingfees.pdf").then((text) => {
  console.log(text);
}).catch((err) => {
  console.log("something went wrong");
  console.error(err);
})

// module.exports = getPdfText