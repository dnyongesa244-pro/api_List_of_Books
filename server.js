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
      Title VARCHAR(50),
      status VARCHAR(20)
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
  {"author": "James Rieng", "name": "The Hall of Fame", "status": 'Reading'},
  {"author": "Andreuw Makabuso", "name": "The Rising Man", "status": "queued"},
  {"author": "Joanna Hekaruko", "name": "The Jungle King", "status": "queued"},
  {"author": "Elizabeth Sonng", "name": "The Dominion of Sansing", "status": "read"},
  {"author": "Robert", "name": "Rich Dad Poor Dad", "status": "read"}
];

// insert seed data into database
function insertSeedData(data){
  for(book of data){

      let query = "INSERT INTO Books (Title, Author, status) VALUES (?, ?, ?)";
      db.run(query, book['name'], book['author'], book['status'], (err)=>{
          if(err){
              console.log('Error seeding the data: ', err);
          }
      });
  }
};
// insertSeedData(seedData)

// -------------------------CRUD----------------------------------



//Read Operation

// GET ALL
app.get('/books', (req, res) => {
  let query = 'SELECT * FROM Books';
  db.all(query, (err, rows)=>{
    if(err){
      res.status(501).json(err.message)
    }
    res.status(200).json(rows)
  })
});


// GET UNIQUE
app.get('/books/:id', (req, res)=>{
  try {
    let bookId = req.params.id;
    bookId = Number(bookId);

    //perfoming the read operation
    const readQuery = "SELECT * FROM Books WHERE id=?";
    db.get(readQuery, [bookId], (err, row) =>{
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
    res.status(500).json({error: error.message});
  }
});


// update operation

// app.put('/book/:id', (req, res, next) => {
//     var updateQuery = req.params;
//     db.run(
//         `UPDATE Books SET Author = ?, Title = ?, status = ? WHERE id = ?`,
//         [req.body.Author, req.body.Title, req.body.status, req.params.id],
//         function (err, result) {
//             if (err) {
//                 res.status(400).json({"error": err.message });
//                 return;
//             }
//             res.status(200).json({ updatedID: req.params.id });
//         } 
//     );
// });


//chat -v

app.put('/update/book/:id', (req, res) => {
    try {
        const bookId = req.params.id;
        const { title, author } = req.body;

        // Check if required fields are present
        if (!title && !author) {
            return res.status(400).json({ error: 'At least one field (title or author) is required for update' });
        }

        // Build update query
        let updateQuery = 'UPDATE Books SET';
        const updateParams = [];
        if (title) {
            updateQuery += ' Title = ?,';
            updateParams.push(title);
        }
        if (author) {
            updateQuery += ' Author = ?,';
            updateParams.push(author);
        }
        // Remove the trailing comma and add WHERE clause
        updateQuery = updateQuery.slice(0, -1) + ' WHERE id = ?';
        updateParams.push(bookId);

        // Execute the update operation
        db.run(updateQuery, updateParams, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            // Check if any row was affected
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Book not found or no changes were made' });
            }
            // Send success response
            res.status(200).json({ message: 'Book updated successfully' });
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ error: error.message });
    }
});





app.post('/create/:title/:author/:status',(req, res)=>{
  try {
    const {title, author, status} = req.params;

    //check the required fields
    if (!title || !author) {
      return res.status(400).json({error:"missing required field"});
    }

    //Do the insertion
    const insertQuery = 'INSERT INTO Books (Author, Title, status) VALUES(?, ?, ?)';
    db.run(insertQuery, [title, author, status], function (err, row) {
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


//Delete Operation
app.delete('/delete/book/:id', (req, res)=>{
  try {
    let bookId = req.params.id;
    bookId = Number(bookId);
    //doing the delete operation
    const deleteQuery = 'DELETE FROM Books WHERE id = ?';
    db.run(deleteQuery, [bookId], (err, row)=> {
      if (err) {
        return res.status(500).json({error: err.message});
      }

      //if no book with given id is not found
      if (this.changes === 0) {
        return res.status(404).json({error: "Book not found"});
      }

      //response to show succes
      res.status(200).json({message :"Book Deleted"});
    }) ;
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});




// --------------------SERVER CONFIGURATION-----------------

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