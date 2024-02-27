const express = require("express");
const router = express.Router();
const {createProduct, getaProduct, getaAllProduct, deleteProduct, updateProduct, getAllProduct, addToWishlist, getWishlist} = require("../Controllers/ProductCtrl");

  router.post("/", createProduct);
  router.get("/:id", getaProduct);
  router.get("/", getaAllProduct);
  router.get("/getall", getAllProduct);
  router.delete("/:id", deleteProduct);
  router.put("/:id", updateProduct);
  router.put("/wishlist", addToWishlist);



  module.exports = router