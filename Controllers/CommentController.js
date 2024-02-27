const comment = require('../Models/Comment.js');
const asyncHandler = require("express-async-handler");

async function getAllComment(req,res){
    try{ 
        const data = await comment.find();
        res.send(data);
    }catch (err){
        res.send(err);
    }
}
// async function addComment(req, res, next) {
//   try {
  
//     const comment = new Comment(req.body);
//     await comment.save();
//     res.status(200).send("add success");
//   } catch (err) {
//     res.status(400).send({ error: error.toString() });
//   }
// }

  const addComment = asyncHandler(async (req, res) => {
    try {
        const newComment = await comment.create(req.body);
        res.json(newComment);
    } catch (error) {
        throw new Error(error);
    }
});

async function getCommentbyid(req, res) {
  try {

    const data = await comment.findById(req.params.id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}
const deleteComment = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deletedComment = await comment.findByIdAndDelete(id);
      res.json(deletedComment);
    } catch (error) {
      throw new Error(error);
    }
  });


const updateComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedComment = await comment.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!updatedComment) {
        return res.status(404).json({ error: "Couldn't find Comment" });
      }
      res.json(updatedComment);
    } catch (error) {
      // Let asyncHandler handle the error
      throw new Error(error);
    }
  });

  module.exports = {
    getAllComment,getCommentbyid,addComment,deleteComment,updateComment
  };