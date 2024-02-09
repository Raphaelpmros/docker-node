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
app.use(express.urlencoded({extended: true}))

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
  }
});

app.get("/products/new", (req, res) => {
  res.render("new");
})

app.post('/products', (req, res) => {
  const newProduct = new Product(req.body)
  res.send('making your product')
})

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    con.query(`SELECT * FROM products WHERE id = '${id}'`, function (err, result, fields) {
      if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (result.length === 0) {
        res.status(404).send('Product not found');
        return;
      }
      const product = result[0];
      console.log(product)
      res.render('show', { product });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(3000, () => {
  console.log("listening on port 3000");
});
