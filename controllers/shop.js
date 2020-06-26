const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/products-list", {
        prods: products,
        title: "products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        title: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getCart = (req, res, next) => {
//   Cart.getCart((cart) => {
//     Product.fetchAll((products) => {
//       const productData = [];
//       for (product of products) {
//         const cartProductData = cart.products.find(
//           (prod) => prod.id === product.id
//         );
//         if (cartProductData) {
//           productData.push({ product: product, qty: cartProductData.qty });
//         }
//       }
//       res.render("shop/cart", {
//         title: "Cart",
//         path: "/cart",
//         products: productData,
//       });
//     });
//   });
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.addProduct(prodId, product.price);
//   });
//   res.redirect("/cart");
// };
//
// exports.cartDeleteItem = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, (product) => {
//     Cart.deleteProduct(prodId, product.price);
//     res.redirect("/cart");
//   });
// };
//
// exports.getOrders = (req, res, next) => {
//   res.render("shop/orders", { title: "Orders", path: "/orders" });
// };
