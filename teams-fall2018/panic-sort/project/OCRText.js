var inspect = require('eyes').inspector({maxLength:20000});
var pdf_extract = require('pdf-extract');
var fs = require('fs');


module.exports = {extract: function extractFile(filePath, mode){



console.log('OCR'+ mode);
console.log('\n');
console.log('\n');
console.log('\n');
console.log('\n');
console.log('\n');

var absolute_path_to_pdf = filePath;


var options = {
  type: mode  // extract the actual text in the pdf file
}
var processor = pdf_extract(absolute_path_to_pdf, options, function(err) {
  if (err) {
    return callback(err);
  }
});
processor.on('complete', function(data) {
  inspect(data.text_pages, 'extracted text pages');
  fs.writeFile(filePath + '.txt' , data.text_pages  , function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
});
processor.on('error', function(err) {
  inspect(err, 'error while extracting pages');
  return callback(err);
});

}}