const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/users");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignUp);
router.get("/reset", authController.getReset);
router.get("/update/:token", authController.getResetPassword);
router.post(
  "/login",
  [
    body("email", "Enter valid email.").isEmail(),
    body("password", "Password should have at least 5 character.").isLength({
      min: 5,
    }),
  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid Email Address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((existingUser) => {
          if (existingUser) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password", "Password is too short")
      .isLength({ min: 5 })
      .trim()
      .isAlphanumeric(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords dont match.");
        }
        return true;
      }),
  ],
  authController.postSignUp
);
router.post("/reset", authController.postReset);
router.post("/reset-password", authController.postResetPassword);

module.exports = router;
