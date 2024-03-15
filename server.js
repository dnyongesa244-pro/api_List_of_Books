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

// fetching data
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Table');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
