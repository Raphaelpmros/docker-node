const con = require("../database/db");

function insertProducts() {
  var sql = "INSERT INTO products (name, price, category) VALUES ?";
  var values = [
    ["Fairy Eggplant", 1.99, "vegetable"],
    ["Organic Goddess Melon", 4.99, "fruit"],
    ["Organic Mini Seedless Watermelon", 3.99, "fruit"],
    ["Organic Celery", 1.5, "vegetable"],
    ["chocolate Whole Milk", 2.69, "dairy"],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    con.end();
  });
}

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql =
    "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, category ENUM('fruit', 'vegetable', 'dairy') NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    insertProducts();
  });
});