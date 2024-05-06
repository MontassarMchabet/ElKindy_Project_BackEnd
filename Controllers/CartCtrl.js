const Cart = require("../Models/Cart");
const User = require("../Models/User");
const expressAsyncHandler = require("express-async-handler");
const Cupon = require("../models/Cupon");


const userCart = expressAsyncHandler(async (req, res) => {
    const { productId,quantity,price } = req.body;
    const  _id  = req.params.idUser;
    try {
     
      let newCart = await new Cart({
        userId:_id,
        productId,
        price,
        quantity
      }).save();
      res.json(newCart);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getUserCart = expressAsyncHandler(async (req, res) => {
    const  _id  = req.params.idUser;
    try {
      const cart = await Cart.find({ userId: _id }).populate(
        "productId"
      );
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });

  const emptyCart = expressAsyncHandler(async (req, res) => {
    const  _id  = req.params.idUser;
    try {
      const user = await User.findOne({ _id });
      const cart = await Cart.deleteMany({ userId:_id });
      res.json(cart);
    } catch (error) {
      throw new Error(error);
    }
  });

  const removeProductFromCart = expressAsyncHandler(async (req, res) => {
    const  _id  = req.params.idUser;
    const { cartItemId } = req.params;
    try {
        const deleteProductFromCart = await Cart.deleteOne({userId:_id,_id:cartItemId})
        res.json(deleteProductFromCart);
      } catch (error) {
        throw new Error(error);
      }
  });

  const updateProductQuantityFromCart = expressAsyncHandler(async (req, res) => {
    const  _id  = req.params.idUser;
    const { cartItemId,newQuantity } = req.params;
    try {
        const cartItem = await Cart.findOne({userId:_id,_id:cartItemId})
        cartItem.quantity=newQuantity;
        cartItem.save();
        res.json(cartItem);
      } catch (error) {
        throw new Error(error);
      }
  });


  const applyCoupon = expressAsyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const  _id  = req.params.idUser;
    const validCoupon = await Cupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
      orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.json(totalAfterDiscount);
  });


  
module.exports = {
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    removeProductFromCart,
    updateProductQuantityFromCart,
};