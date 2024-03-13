# Api_List_of_Books
Get a list of books with the GET command, add a new book with POST, change an old book with PUT, or remove a book with DELETE

## Initialized the database

- npm install sqlite3
- npm install express\
I added some custom books into the db\
server runs on port 5000 but you can change it\

### running the database
- step 1: uncomment line 54 -`insertSeedData(seedData)`
- step 2: run app
`node index.js`
- step3: comment step 1 to avoid duplicate data
### Quering the database

1. fetching items run `db.get(your query here)`
2. insert records `db.run(your query here)`
