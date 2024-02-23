const express = require("express");
const router = express.Router();
const {createProduct, getaProduct, getaAllProduct, deleteProduct, updateProduct} = require("../Controllers/ProductCtrl");

  router.post("/", createProduct);
  router.get("/:id", getaProduct);
  router.get("/", getaAllProduct);
  router.delete("/:id", deleteProduct);
  router.put("/:id", updateProduct);


  module.exports = router