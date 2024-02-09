const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "mysql-db",
  user: "root",
  password: "root",
  database: "products",
});

con.connect(function (err) {
  if (err) throw err;
  return (allProducts = con.query(
    "SELECT * FROM products",
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    }
  ));
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const allProductsPromise = new Promise((resolve, reject) => {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});


app.get("/products", async (req, res) => {
  try {
    const products = await allProductsPromise;
    console.log(products);
    res.render("products", { products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
