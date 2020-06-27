const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "add-product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const product = new Product(
    title,
    imageUrl,
    price,
    description,
    null,
    userId
  );
  product
    .save()
    .then((result) => {
      res.redirect("/products");
    })
    .catch((err) => {
      throw err;
    });
};

exports.getEditProduct = (req, res, next) => {
  const editing = req.query.edit;
  const prodId = req.params.productId;
  if (!editing) {
    return res.redirect("/");
  }
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        title: "edit-product",
        path: "/admin/edit-product",
        editing: editing,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updateDescription = req.body.description;
  const userId = req.user._id;
  const updatedProduct = new Product(
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updateDescription,
    id,
    userId
  );
  updatedProduct
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminProduct = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        title: "admin-products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
