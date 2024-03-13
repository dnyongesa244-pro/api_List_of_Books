const express = require('express');
const { request } = require('http');
const sqlite3 = require('sqlite3');

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
// insertSeedData(seedData)


// CRUD commands written here

// GET

// POST

// PUT
// I will continue tommorow
app.put('/book/:id', (req, res)=>{
    let bookId = req.params.id;
    bookId = Number(bookId);

    let query = 'SELECT Title FROM Books WHERE id = ?';
    let book = db.run(query, bookId, ()=>{
        res.send(book)
    })
    console.log(book)
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