const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const User = require("./models/users");

const app = express();
const store = new MongoStore({
  url: "mongodb://127.0.0.1:27017/shop",
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use((req, res, next) => {
  res.locals.logIn = req.session.isLoggedIn;
  res.locals._csrf = req.csrfToken();
  next();
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect("mongodb://127.0.0.1:27017/shop", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(3000);
  });
