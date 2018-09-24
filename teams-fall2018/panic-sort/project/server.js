var http = require('http');
var fs = require('fs');
var formidable = require('formidable');


http.createServer(function (req, res) {
  if(req.url === '/'){
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });} else if(req.url === '/upload'){
    var currentPath = process.cwd();
    var form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){

      var timeStamp = new Date() / 1000;
      var oldpath = files.filetoupload.path;
      //
      console.log(currentPath);
      console.log(files.filetoupload.name);
      //
      var newpath = currentPath +'/uploads/' +timeStamp+ files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
  }
}).listen(3000);
