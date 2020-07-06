const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalItems = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/products-list", {
        prods: products,
        title: "products",
        path: "/products",
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: totalItems / ITEMS_PER_PAGE > page,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        // logIn: req.session.isLoggedIn,
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
        // logIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((totalProducts) => {
      totalItems = totalProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        title: "shop",
        path: "/",
        currentPage: page,
        hasPrevPage: page > 1,
        hasNextPage: totalItems / ITEMS_PER_PAGE > page,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        // logIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products: products,
        // logIn: req.session.isLoggedIn,
      });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.cartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(() => {
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  const userId = req.user._id;
  Order.find({ "user.userId": userId }).then((orders) => {
    res.render("shop/orders", {
      title: "Orders",
      path: "/orders",
      orders: orders,
      // logIn: req.session.isLoggedIn,
    });
  });
};

exports.postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      const updatedProducts = products.map((prod) => {
        return { product: { ...prod.productId._doc }, quantity: prod.quantity };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
        products: updatedProducts,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join(__dirname, "..", "invoices", invoiceName);
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("Order not found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("wrong user for this order"));
      }
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline;filename=${invoiceName}`);
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(24).text("Invoice", { align: "center" });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.product.price * prod.quantity;
        pdfDoc
          .fontSize(15)
          .text(
            `${prod.product.title} - ${prod.quantity} * ${prod.product.price}`
          );
      });
      pdfDoc.fontSize(20).text(`Total Price = ${totalPrice}`, {
        align: "center",
      });
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `attachment;filename=${invoiceName}`
      //   );
      //   res.send(data);
      // });
    })
    .catch((err) => {
      next(err);
    });
};
