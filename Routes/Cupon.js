const express = require("express");
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon } = require("../Controllers/CuponCtrl");
const router = express.Router();

router.post("/",  createCoupon);
router.get("/",  getAllCoupons);
router.get("/:id", getCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

  module.exports = router