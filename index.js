const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');


const con = mysql.createConnection({
  host: 'mysql-db',
  user: 'root',
  password: 'root',
  database: 'products',
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/dog', (req, res) => {
  res.send("WOLF")
})

app.listen(3000, () => {
  console.log("listening on port 3000")
})