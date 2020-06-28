const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectID,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const existingProductIndex = this.cart.items.findIndex((prod) => {
    return prod.productId.toString() === product._id.toString();
  });
  let quantity = 1;
  let updatedCart = { ...this.cart };
  if (existingProductIndex >= 0) {
    quantity = updatedCart.items[existingProductIndex].quantity + 1;
    updatedCart.items[existingProductIndex].quantity = quantity;
  } else {
    updatedCart.items.push({ productId: product._id, quantity: quantity });
  }
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  let updatedCartItems = this.cart.items.filter((prod) => {
    return prod.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongoDb = require("mongodb");
// const getDb = require("../utils/connection").getDb;
//
// class User {
//   constructor(userName, email, cart, id) {
//     this.name = userName;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }
//   static userById(userId) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: mongoDb.ObjectId(userId) });
//   }
//   addToCart(product) {
//     const existingProductIndex = this.cart.products.findIndex((prod) => {
//       return prod.productId.toString() === product._id.toString();
//     });
//     let quantity = 1;
//     let updatedCart = { ...this.cart };
//     if (existingProductIndex >= 0) {
//       quantity = updatedCart.products[existingProductIndex].qty + 1;
//       updatedCart.products[existingProductIndex].qty = quantity;
//     } else {
//       updatedCart.products.push({ productId: product._id, qty: quantity });
//     }
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   getCart() {
//     const db = getDb();
//     const cartProductIds = this.cart.products.map((prod) => {
//       return prod.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: cartProductIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.products.find((prod) => {
//               return prod.productId.toString() === p._id.toString();
//             }).qty,
//           };
//         });
//       });
//   }
//   getOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             userId: new mongoDb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("Orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart.products = [];
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongoDb.ObjectId(this._id) },
//             { $set: { cart: { products: [] } } }
//           );
//       });
//   }
//   getAllOrders() {
//     const db = getDb();
//     return db.collection("Orders").find({ "user.userId": this._id }).toArray();
//   }
//   deleteById(prodId) {
//     let updatedCartProducts = this.cart.products.filter((prod) => {
//       return prod.productId.toString() !== prodId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongoDb.ObjectId(this._id) },
//         { $set: { cart: { products: updatedCartProducts } } }
//       );
//   }
// }
//
// module.exports = User;
