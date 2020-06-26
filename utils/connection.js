const mongoDb = require("mongodb");
const mongoClient = mongoDb.MongoClient;

let _db;
const mongoConnect = () => {
  return mongoClient
    .connect("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true })
    .then((client) => {
      _db = client.db("shop");
      console.log("connected to database");
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
