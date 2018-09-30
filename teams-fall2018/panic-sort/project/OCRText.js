const inspect = require('eyes').inspector({ maxLength: 20000 });
const pdf_extract = require('pdf-extract');
const fs = require('fs');
const pruner = require('./read');
let pruned;

module.exports = {
  extract: function f(filePath, mode) {
    return extractFile(filePath, mode);
  }
}

function extractFile(filePath, mode) {

  return new Promise((resolve, reject) => {
    console.log(filePath);

    console.log('OCR' + mode);
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    var flag = false;
    const absolute_path_to_pdf = filePath;


    var options = {
      type: mode  // extract the actual text in the pdf file
    }
    var processor = pdf_extract(absolute_path_to_pdf, options, function (err) {
  
    });

    processor.on('complete', function (data) {
      inspect(data.text_pages, 'extracted text pages');

      fs.writeFileSync(filePath + '.txt', data.text_pages);

      //res.write(pruned);
      pruned = pruner.prune(filePath + '.txt');
      console.log('ocr: ' + JSON.stringify(pruned));
      resolve(pruned);
    });
    
  });

  processor.on('error', function (err) {
    console.log('er');
    inspect(err, 'error while extracting pages');
    reject(err);
  });


}

