const fs = require("fs");
const path = require("path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }
  save() {
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
};
