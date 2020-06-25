const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "data",
      "products.json"
    );
    if (this.id) {
      fs.readFile(p, (err, fileContent) => {
        let products = [];
        if (!err) {
          products = JSON.parse(fileContent);
        }
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        products[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      });
    } else {
      this.id = Math.random().toString();
      fs.readFile(p, (err, fileContent) => {
        let products = [];
        if (!err) {
          products = JSON.parse(fileContent);
        }
        products.push(this);
        const data = JSON.stringify(products);
        fs.writeFile(p, data, (err) => {
          console.log(err);
        });
      });
    }
  }

  static fetchAll(cb) {
    const p = path.join(__dirname, "..", "data", "products.json");
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }

  static findById(id, cb) {
    const p = path.join(__dirname, "..", "data", "products.json");
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        let products;
        products = JSON.parse(fileContent);
        const product = products.find((p) => p.id === id);
        cb(product);
      }
    });
  }

  static deleteById(id) {
    const p = path.join(__dirname, "..", "data", "products.json");
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
};
