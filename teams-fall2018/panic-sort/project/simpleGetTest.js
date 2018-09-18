const http = require('http');

const server = http.createServer((req,res) => {
   if (req.url === '/') {
      res.write('hello World');
      res.end();
   }
   
   if (req.url === '/kevin'){
      res.write('I am Kevin!');
      res.end();
   }
});

server.listen(3000);
//console.log('listening on p 3000');
