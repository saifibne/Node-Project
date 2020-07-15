const bCrypt = require("bcryptjs");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const sendGridTransporter = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const User = require("../models/users");

const transporter = nodeMailer.createTransport(
  sendGridTransporter({
    auth: {
      api_key:
        "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",
    },
  })
);
exports.getLogin = (req, res, next) => {
  const message = req.flash("error")[0];
  const successMessage = req.flash("success")[0];
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    title: "Login",
    errorMessage: message,
    successMessage: successMessage,
    errors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      title: "Login",
      errorMessage: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
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
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: [],
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      title: "SignUp",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      errors: errors.array(),
    });
  }
  return bCrypt
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
      return transporter
        .sendMail({
          to: email,
          from: "ibnesaif3g@gmail.com",
          subject: "Account Created",
          html: "<h1>Account created successfully!!</h1>",
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

exports.getReset = (req, res, next) => {
  const message = req.flash("error")[0];
  res.render("auth/reset", {
    path: "/reset",
    title: "reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Wrong email address!");
      return res.redirect("/reset");
    }
    crypto.randomBytes(32, (err, buffer) => {
      let token;
      if (!err) {
        token = buffer.toString("hex");
        user.resetToken = token;
        user.tokenExpire = Date.now() + 3600000;
        user.save();
        res.redirect("/reset");
      }
      transporter.sendMail({
        to: email,
        from: "ibnesaif3g@gmail.com",
        subject: "Password Reset",
        html: `<p>localhost:3000/update/${token}</p>`,
      });
    });
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, tokenExpire: { $gt: Date.now() } }).then(
    (user) => {
      const userId = user._id.toString();
      res.render("auth/reset-password", {
        path: "/reset-password",
        title: "reset Password",
        userId: userId,
      });
    }
  );
};

exports.postResetPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  User.findOne({ _id: userId, tokenExpire: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/reset");
      }
      return bCrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.tokenExpire = undefined;
          user.save();
        })
        .then((result) => {
          req.flash("success", "Password changed successfully.");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
