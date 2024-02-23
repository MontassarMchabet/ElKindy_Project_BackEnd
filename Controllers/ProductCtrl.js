const Product = require('../Models/Product');
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const findProduct = await Product.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getaAllProduct = asyncHandler(async (req, res) => {
    try {
      const findAllProduct = await Product.find();
      res.json(findAllProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deleteProduct = await Product.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      // Let asyncHandler handle the error
      throw new Error(error);
    }
  });

module.exports = {
    createProduct,
    getaProduct,
    getaAllProduct,
    deleteProduct,
    updateProduct,
};