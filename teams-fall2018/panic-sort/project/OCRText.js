const inspect = require('eyes').inspector({ maxLength: 20000 });
const pdf_extract = require('pdf-extract');
const fs = require('fs');
const pruner = require('./read');

module.exports = {
  extract: function extractFile(filePath, mode) {

    console.log(filePath);

    console.log('OCR' + mode);
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');
    console.log('\n');

    const absolute_path_to_pdf = filePath;


    var options = {
      type: mode  // extract the actual text in the pdf file
    }
    var processor = pdf_extract(absolute_path_to_pdf, options, function (err) {
      if (err) {
        return callback(err);
      }
    });
    processor.on('complete', function (data) {
      inspect(data.text_pages, 'extracted text pages');

      fs.writeFileSync(filePath + '.txt', data.text_pages);
      let pruned = pruner.prune(filePath + '.txt');
      console.log(pruned);
      return pruned;
    });
    processor.on('error', function (err) {
      inspect(err, 'error while extracting pages');
      return callback(err);
    });

  }
}