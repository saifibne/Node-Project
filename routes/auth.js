const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignUp);
router.get("/reset", authController.getReset);
router.get("/update/:token", authController.getResetPassword);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/signup", authController.postSignUp);
router.post("/reset", authController.postReset);
router.post("/reset-password", authController.postResetPassword);

module.exports = router;
