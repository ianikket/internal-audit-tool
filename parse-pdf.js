const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = './docs/Internal Audit tool PRD.pdf';

let dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    // Print all text from the PDF
    console.log(data.text);
}); 