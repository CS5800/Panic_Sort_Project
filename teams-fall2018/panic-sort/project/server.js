const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
//var bodyParser = require('body-parser');
const express = require('express');
const app = express();
const ocr = require('./OCRText');

//var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.get('/', function (req, res) {
  fs.readFile('index.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
});
////////////////////////////////////////////////////////////////////////

app.post('/upload', function (req, res) {
  const currentPath = process.cwd();
  let pruned;

  a();


  function a() {

    let timeStamp = new Date() / 1000;
    let oldpath;
    let newpath;

    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      oldpath = files.filetoupload.path;
      newpath = currentPath + '/uploads/' + timeStamp + files.filetoupload.name;
      //
      //  console.log(currentPath);
      // console.log(files.filetoupload.name);
      // console.log(fields);
      //


      fs.renameSync(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');

      });
      // console.log(newpath);
      // console.log(fields);
      // console.log('');
      // console.log('');
      // console.log('');
      // console.log('');

      console.log(b(newpath, fields));
    });

  }

  function b(newpath, fields) {


    // console.log(newpath);
    // console.log(fields);
    // console.log(fields.parseType);




    ocr.extract(newpath, fields.parseType)
    .then(pruned => res.send(pruned))
    .catch(err => res.send(err));

    // console.log('b{');
    // console.log( pruned);
    // console.log('}');
  }
});


app.listen(3000);












