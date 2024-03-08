const express = require("express");
const router = express.Router();
const {createProduct, getaProduct, getaAllProduct, deleteProduct, updateProduct, getAllProduct, addToWishlist, rating} = require("../Controllers/ProductCtrl");

  router.post("/", createProduct);
  router.get("/:id", getaProduct);
  router.get("/", getaAllProduct);
  router.get("/getall", getAllProduct);
  router.delete("/:id", deleteProduct);
  router.put("/:id", updateProduct);
  router.put("/wishlist/:idUser", addToWishlist);
  router.put("/rating/:idUser", rating);



  module.exports = router