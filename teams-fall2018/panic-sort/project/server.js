var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
//var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var ocr = require('./OCRText');

//var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.get('/', function(req, res){
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });});

app.post('/upload',function(req,res){
    var currentPath = process.cwd();
    var form = new formidable.IncomingForm();
   



    form.parse(req,function(err,fields,files){

      var timeStamp = new Date() / 1000;
      var oldpath = files.filetoupload.path;
      //
      console.log(currentPath);
      console.log(files.filetoupload.name);
      console.log(fields);
      //
      var newpath = currentPath +'/uploads/' +timeStamp+ files.filetoupload.name;
      
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');

        

      
        ocr.extract(newpath,fields.parseType);// find a way to get checkbox info, here
        res.end();
      });

    }) ;
  });

app.listen(3000);
