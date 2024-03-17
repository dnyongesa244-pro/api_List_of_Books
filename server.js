const express = require("express");
const sqlite3 = require('sqlite3').verbose();

const app = express();

// -------setting up the sqlite3 database--------
const db = new sqlite3.Database('./books.db', (err)=>{
  if(err){
      console.log("Error connecting to database:", err);
  }
  else{
      console.log('Connected to SQlite database');
  }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Books(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Author VARCHAR(50),
      Title VARCHAR(50)
  )
`;

// use db.run() to execute a query
db.run(createTableQuery, (err) =>{
  if(err){
      console.log("Error creating table: ", err);
  }
});


// custom books
const seedData = [
  {"author": "James Rieng", "name": "The Hall of Fame"},
  {"author": "Andreuw Makabuso", "name": "The Rising Man"},
  {"author": "Joanna Hekaruko", "name": "The Jungle King"},
  {"author": "Elizabeth Sonng", "name": "The Dominion of Sansing"},
  {"author": "Robert", "name": "Rich Dad Poor Dad"}
];

// insert seed data into database
function insertSeedData(data){
  for(book of data){

      let query = "INSERT INTO Books (Title, Author) VALUES (?, ?)";
      db.run(query, book['name'], book['author'], (err)=>{
          if(err){
              console.log('Error seeding the data: ', err);
          }
      });
  }
};

//Operations
//create operation - post
app.post('/create/book',(req, res)=>{
  try {
    const {title, auther} = req.body;

    //check the required fields
    if (!title || !auther) {
      return res.status(400).json({error:"missing required field"});
    }

    //Do the insertion
    const insertQuery = 'INSERT INTO Books (Title, Auther) VALUES(?,?)';
    db.run(insertQuery, [title,auther], function (err) {
      if (err) {
        return res.status(500).json({error: err.message});
      }

      //send response for success
      res.status(201).json({message: "Book created succesfully"});
    });
  } catch (error) {
    res.status(500).json({error: error.message})
  }
});

//Read Operation
//Get
app.get('/books:id', (req, res)=>{
  try {
    const bookId = req.params.id;
    bookId = Number(bookId);

    //perfoming the read operation
    const readQuery = "SELECT * FROM Books WHERE id=?";
    db.get(readQuery, [bookId], function (err, row) {
      if (err) {
        return res.status(500).json({error: err.message});
      }

      //return message "book not found" if no book is found
      if (!row) {
        return res.status(404).json({error: "Book not found"});
      }

      //response for book retreaved
      res.status(200).json(row);
    });
  } catch (error) {
    res.status(500).json({error: err.message});
  }
});

//Delete Operation
app.delete('/delete/book/:id', (req, res)=>{
  try {
    const bookId = req.params.id;

    //doing the delete operation
    const deleteQuery = 'DELETE FROM Books WHERE id = ?';
    db.run(deleteQuery, [bookId], function (err) {
      if (err) {
        return res.status(500).json({error: err.message});
      }

      //if no book with given id is not found
      if (this.changes === 0) {
        return res.status(404).json({error: "Book not found"});
      }

      //response to show succes
      res.status(200).json({message: "Book deleted successfully"});
    }) ;
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});








// insertSeedData(seedData)


// CRUD commands written here

// GET

// POST

// PUT
// I will continue tommorow
app.put('/update/book/:id/:book', (req, res)=>{
    let bookId = req.params.id;
    bookId = Number(bookId);

    let query = 'SELECT Title FROM Books WHERE id = ?';
    let book = db.get(query,[bookId], (err, row)=>{
        if(err){
            res.json('record not found')
        }
        res.json(row)
    });
    
    // console.log(book)
    // res.send(book)
});


// DELETE







// start the express server
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`sever running on http://localhost:${PORT}`);
});


// closing the application gracefully
process.on('exit', ()=>{
    db.close( (err)=>{
        if(err){
            console.error(err.message);
        }
        console.log("Closed the SQlite database connection.");
    });
});