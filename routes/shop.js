const path = require("path");
const express = require("express");
const router = express.Router();
const adminData = require("./admin");

const products = adminData.products;
router.get("/", (req, res, next) => {
  res.render("shop", { prods: products, title: "Shop", path: "/" });
});

module.exports = router;
