const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const methodOverride = require("method-override");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const allProductsPromise = new Promise((resolve, reject) => {
  con.query("SELECT * FROM products", function (err, result) {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

app.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      const filterProductsByCategory = new Promise((resolve, reject) => {
        con.query(`SELECT * FROM products WHERE category = '${category}'`, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const productsByCategory = await filterProductsByCategory;
      res.render("products", { products: productsByCategory, category }); // Corrigindo aqui
    } else {
      const products = await allProductsPromise;
      res.render("products", { products, category: 'All' });
    }
  } catch (err) {
    console.error(err);
  }
});



app.get("/products/new", (req, res) => {
  res.render("new");
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    con.query(
      `INSERT INTO products (name, price, category) VALUES (?, ?, ?)`,
      [name, price, category],
      function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).send("Erro ao salvar o produto no banco de dados.");
          return;
        }
        res.redirect("/products");
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno do servidor.");
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    con.query(
      `SELECT * FROM products WHERE id = '${id}'`,
      function (err, result, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        if (result.length === 0) {
          res.status(404).send("Product not found");
          return;
        }
        const product = result[0];
        console.log(product);
        res.render("show", { product });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;

    con.query(
      `SELECT * FROM products WHERE id = '${id}'`,
      function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).send("Erro ao buscar o produto no banco de dados.");
          return;
        }

        if (result.length === 0) {
          res.status(404).send("Produto não encontrado.");
          return;
        }

        const product = result[0];
        res.render("edit", { product });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno do servidor.");
  }
});

app.post("/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;

    con.query(
      `UPDATE products SET name = ?, price = ?, category = ? WHERE id = ?`,
      [name, price, category, id],
      function (err, result) {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send("Erro ao atualizar o produto no banco de dados.");
          return;
        }

        res.redirect("/products");
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno do servidor.");
  }
});

app.delete("/products/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    con.query("DELETE FROM products WHERE id=?", [id], function (err) {
      if (err) throw err;
      res.redirect("/products");
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
