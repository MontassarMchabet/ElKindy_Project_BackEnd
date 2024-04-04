const express = require("express");
const router = express.Router();
const { userCart, getUserCart, emptyCart, applyCoupon, removeProductFromCart, updateProductQuantityFromCart } = require("../Controllers/CartCtrl");

router.post("/add/:idUser", userCart);
router.get("/get/:idUser", getUserCart);
router.delete("/empty-cart/:idUser", emptyCart);
router.delete("/delete-product-cart/:idUser/:cartItemId", removeProductFromCart);
router.put("/update-product-cart/:idUser/:cartItemId/:newQuantity", updateProductQuantityFromCart);
router.post("/applycoupon/:idUser", applyCoupon);

  module.exports = router