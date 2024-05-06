const Comment = require('../Models/Comment');
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

async function getAllComment(req,res){
    try{ 
        const data = await Comment.find();
        res.send(data);
    }catch (err){
        res.send(err);
    }
}
const addComment = asyncHandler(async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const newComment = await Comment.create({
      event: eventId,
      ...req.body // Ajoutez les autres champs du commentaire à partir de la requête
    });
    res.json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});


async function getCommentbyid(req, res) {
  try {

    const data = await Comment.findById(req.params.id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

const deleteComment = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deletedComment = await Comment.findByIdAndDelete(id);
      res.json(deletedComment);
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteMyComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId= req.body.user;
    console.log("ID usseerr delete :", userId);
    try {
    
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  

      if (comment.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
 
      await Comment.findByIdAndDelete(id);
  
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment" });
    }
  });
  
  


const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du commentaire depuis les paramètres de la requête
  console.log("ID récupéré côté serveur :", id);
  const userId= req.body.user; 
  console.log("ID usseerr récupéré côté serveur :", userId);

  try {
    // Trouver le commentaire par son ID
    let comment = await Comment.findById(id);

    // Vérifier si le commentaire existe
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mettre à jour le contenu du commentaire avec la nouvelle valeur
    comment.comment = req.body.comment; // Utiliser req.body.comment pour récupérer la nouvelle valeur du commentaire

    // Sauvegarder le commentaire mis à jour dans la base de données
    comment = await comment.save();

    // Renvoyer le commentaire mis à jour dans la réponse
    res.json({ updatedComment: comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
});

  module.exports = {
    getAllComment,getCommentbyid,addComment,deleteComment,updateComment,deleteMyComment
  };