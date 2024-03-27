var http = require('http');
var fs = require('fs');
const { threadId } = require('worker_threads');

http.createServer(function(req, res){
    fs.readFile('client.html',function(err, data){
        res.writeHead(200,{'Content-Type':'text/html'});
        if(err) throw err;
        res.write(data);
        res.end();
    });
}).listen(4000, ()=>{
    console.log("Server running at port 4000");
})