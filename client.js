// var http = require('http');
// var fs = require('fs');
// const { threadId } = require('worker_threads');

// http.createServer(function(req, res){
//     fs.readFile('client.html',function(err, data){
//         res.writeHead(200,{'Content-Type':'text/html'});
//         if(err) throw err;
//         res.write(data);
//         res.end();
//     });
// }).listen(4000, ()=>{
//     console.log("Server running at port http://localhost:4000");
// })

// const express = require('express');
// const app = express();

// app.set('view engine', 'ejs');

// app.get('/books', (req, res) => {
//     let query = 'SELECT * FROM Books';
//     db.all(query, (err, books)=>{
//       if(err){
//         res.status(501).json(err.message)
//       }
//       res.render('client', book);
//     })
// });

// const port = 4000;
// app.listen(port, ()=> {
//     `client running on http://localhost:${port}`;
// });
