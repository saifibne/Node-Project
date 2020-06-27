const mongoDb = require("mongodb");
const getDb = require("../utils/connection").getDb;

class User {
  constructor(userName, email) {
    this.name = userName;
    this.email = email;
  }
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }
  static userById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: mongoDb.ObjectId(userId) });
  }
}

module.exports = User;
