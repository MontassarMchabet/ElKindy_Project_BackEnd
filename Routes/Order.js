const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getAllOrders, updateOrderStatus, getMyOrder, deleteOrder, getSingleOrder, sendMail } = require("../Controllers/OrderCtrl");
const { Add, Verify } = require("../Controllers/Payement");
const { createNotif, getAllNotifs, updateNotifStatus } = require("../Controllers/OrderNotifController");

router.post("/cash-order/:idUser", createOrder);
router.get("/get-orders/:idUser", getOrders);
router.delete("/delete/:id", deleteOrder);
router.get("/getsingleorder/:id", getSingleOrder);
router.get("/getmyorders/:idUser", getMyOrder);
router.get("/getallorders", getAllOrders);
router.put("/update-order/:id", updateOrderStatus);
router.put("/notifs", updateNotifStatus);
router.post("/payement", Add)
router.get("/payement/:id", Verify) 
router.get("/notifs", getAllNotifs) 
router.post('/orderMail', sendMail)
router.post('/notif', createNotif)

  module.exports = router 