const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const mongoConnect = require("./utils/connection").mongoConnect;

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
// app.use(errorController.get404);

mongoConnect().then(() => {
  app.listen(3000);
});
