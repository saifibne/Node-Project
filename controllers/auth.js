const User = require("../models/users");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    logIn: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5ef8e62c4054b027b4d158f4")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
