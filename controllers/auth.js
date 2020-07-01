const bCrypt = require("bcryptjs");
const User = require("../models/users");

exports.getLogin = (req, res, next) => {
  const message = req.flash("error")[0];
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      return bCrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          req.flash("error", "Invalid email or password");
          return res.redirect("/login");
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          res.redirect("/");
        });
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

exports.getSignUp = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("auth/signup", {
    path: "/signup",
    title: "SignUp",
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        req.flash("error", "Email already exists.");
        return res.redirect("/signup");
      }
      bCrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((user) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
