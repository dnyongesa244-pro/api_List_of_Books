const express = require("express");
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// database connection 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'Kipngetich222',
  password: 'PHW#84#vic',
  database: ''
});


app.get('/', (req, res) => {
    res.send("Welcome");
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
