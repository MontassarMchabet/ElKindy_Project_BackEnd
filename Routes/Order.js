const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getAllOrders, updateOrderStatus, getMyOrder, deleteOrder } = require("../Controllers/OrderCtrl");
const { Add, Verify } = require("../Controllers/Payement");

router.post("/cash-order/:idUser", createOrder);
router.get("/get-orders/:idUser", getOrders);
router.delete("/delete/:id", deleteOrder);
router.get("/getmyorders/:idUser", getMyOrder);
router.get("/getallorders", getAllOrders);
router.put("/update-order/:id", updateOrderStatus);
router.post("/payement", Add)
router.get("/payement/:id", Verify) 

  module.exports = router 