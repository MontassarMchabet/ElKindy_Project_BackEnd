const Cart = require("../Models/Cart");
const User = require("../Models/User");
const expressAsyncHandler = require("express-async-handler");
const product = require("../Models/product");
const Cupon = require("../models/Cupon");
const Order = require("../models/Order");
const uniqid = require("uniqid");



const createOrder = expressAsyncHandler(async (req, res) => {
    const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount } = req.body;
    const _id = req.params.idUser;
    try {
        const order = await Order.create({
            shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,user:_id
        })
        res.json({order,success:true});
    } catch (error) {
        throw new Error(error);
    }
}); 

const getOrders = expressAsyncHandler(async (req, res) => {
    const _id = req.params.idUser;
    try {
        const userorders = await Order.findOne({ orderby: _id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});

const getMyOrder = expressAsyncHandler(async (req, res) => {
  const _id = req.params.idUser;
  try {
      const orders = await Order.find({ user: _id }).populate("user").populate("orderItems.productId")
      res.json({
        orders
      });
  } catch (error) {
      throw new Error(error);
  }
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("orderItems.productId")
            .populate("user")
            .exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});


const updateOrderStatus = expressAsyncHandler(async (req, res) => {
    const { status } = req.body;
    const id = req.params.id;
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteOrder = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    res.json(deletedOrder);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    getMyOrder,
    deleteOrder,
};