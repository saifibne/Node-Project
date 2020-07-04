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
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const product = new Product({
    title: title,
    imageUrl: `/${image.path}`,
    price: price,
    description: description,
    userId: userId,
  });
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
  const updatedImage = req.file;
  const updatedPrice = req.body.price;
  const updateDescription = req.body.description;
  Product.findById(id)
    .then((product) => {
      if (req.user._id.toString() !== product.userId.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      if (updatedImage) {
        const updatedImageUrl = `/${updatedImage.path}`;
        product.imageUrl = updatedImageUrl;
      }
      product.price = updatedPrice;
      product.description = updateDescription;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAdminProduct = (req, res, next) => {
  Product.find({ userId: req.user._id })
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
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
