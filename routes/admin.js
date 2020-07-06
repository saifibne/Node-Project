const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/authcheck");

router.get("/add-product", isAuth, adminController.getAddProduct);
router.get("/products", isAuth, adminController.getAdminProduct);
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);
router.delete("/delete/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
