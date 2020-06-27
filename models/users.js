const mongoDb = require("mongodb");
const getDb = require("../utils/connection").getDb;

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  static userById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: mongoDb.ObjectId(userId) });
  }
  addToCart(product) {
    const existingProductIndex = this.cart.products.findIndex((prod) => {
      return prod.productId.toString() === product._id.toString();
    });
    let quantity = 1;
    let updatedCart = { ...this.cart };
    if (existingProductIndex >= 0) {
      quantity = updatedCart.products[existingProductIndex].qty + 1;
      updatedCart.products[existingProductIndex].qty = quantity;
    } else {
      updatedCart.products.push({ productId: product._id, qty: quantity });
    }
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
  getCart() {
    const db = getDb();
    const cartProductIds = this.cart.products.map((prod) => {
      return prod.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: cartProductIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.products.find((prod) => {
              return prod.productId.toString() === p._id.toString();
            }).qty,
          };
        });
      });
  }
  deleteById(prodId) {
    let updatedCartProducts = this.cart.products.filter((prod) => {
      return prod.productId.toString() !== prodId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { products: updatedCartProducts } } }
      );
  }
}

module.exports = User;
