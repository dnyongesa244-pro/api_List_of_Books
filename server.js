const express = require("express");
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

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



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
