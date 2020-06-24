const fs = require("fs");
const path = require("path");

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }
  save() {
    this.id = Math.random().toString();
    const p = path.join(__dirname, "..", "data", "products.json");
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
};
