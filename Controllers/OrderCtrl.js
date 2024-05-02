const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const sendEmail = require('../Controllers/NodeMailer');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'EmailTemplate', 'SendOrderEmail.html');




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
    const id = req.params.id;
    try {
        const orders = await Order.findById(id);
        orders.orderStatus = req.body.orderStatus;
        await orders.save()  
        res.json({
          orders
        });
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

const getSingleOrder = expressAsyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
      const orders = await Order.findOne(_id)
      res.json({orders});
  } catch (error) {
      throw new Error(error);
  }
});

const sendMail = async (req, res) => {
    const { email, username } = req.body;
    try {
        const htmlTemplate = fs.readFileSync(filePath, 'utf8');
        const emailContent = htmlTemplate
            .replace('{{ email }}', email)
            .replace('{{ username }}', username);
        const data = {
            to: email,
            subject: " Confirmation of Your Recent Order",
            html: emailContent
        };
        await sendEmail(data, req, res);

        res.status(200).json({ message: 'Mail sent successfully'});
    } catch (error) {
        console.error('Error sending Mail:', error);
        res.status(500).json({ message: 'Error sending Mail' });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getAllOrders,
    updateOrderStatus,
    getMyOrder,
    deleteOrder,
    getSingleOrder,
    sendMail,
};