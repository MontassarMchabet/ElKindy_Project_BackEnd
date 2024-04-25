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

    // Vérifier si l'identifiant de l'événement est valide
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Créer un nouvel objet de commentaire en spécifiant l'ID de l'événement
    const newComment = await Comment.create({
      event: eventId,
      ...req.body // Ajoutez les autres champs du commentaire à partir de la requête
    });

    // Répondre avec le nouveau commentaire créé
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

  // const deleteMyComment = asyncHandler(async (req, res) => {
  //   const { id } = req.params;
  //   const userId = "65df69dae61e837fa7eae0ec"; // Récupérer l'ID de l'utilisateur connecté
  
  //   try {
  //     // Vérifier si le commentaire existe
  //     const comment = await Comment.findById(id);
  //     if (!comment) {
  //       return res.status(404).json({ message: "Comment not found" });
  //     }
  
  //     // Vérifier si l'utilisateur est l'auteur du commentaire
  //     if (comment.user.toString() !== userId) {
  //       return res.status(403).json({ message: "Unauthorized" });
  //     }
  
  //     // Supprimer le commentaire de la base de données
  //     await comment.remove();
  
  //     res.json({ message: "Comment deleted successfully" });
  //   } catch (error) {
  //     console.error("Error deleting comment:", error);
  //     res.status(500).json({ message: "Error deleting comment" });
  //   }
  // });
  
  const deleteMyComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = "65df69dae61e837fa7eae0ec"; // Récupérer l'ID de l'utilisateur connecté
  
    try {
      // Vérifier si le commentaire existe
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      // Vérifier si l'utilisateur est l'auteur du commentaire
      if (comment.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      // Supprimer le commentaire de la base de données
      await Comment.findByIdAndDelete(id);
  
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment" });
    }
  });
  
  

// const updateComment = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     try {
//       const updatedComment = await comment.findOneAndUpdate({ _id: id }, req.body, {
//         new: true,
//       });
//       if (!updatedComment) {
//         return res.status(404).json({ error: "Couldn't find Comment" });
//       }
//       res.json(updatedComment);
//     } catch (error) {
//       // Let asyncHandler handle the error
//       throw new Error(error);
//     }
//   });
  
// const updateComment = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Supposons que l'ID du commentaire soit envoyé dans le corps de la requête

//   const userId =  req.body; // Supposons que l'ID de l'utilisateur soit stocké dans req.user.id

//   try {
//     // Trouver le commentaire par son ID
//     const comment = await Comment.findById(id);

//     // Vérifier si le commentaire existe
//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     // Vérifier si l'utilisateur est l'auteur du commentaire
//     if (comment.user.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // Mettre à jour le contenu du commentaire
//     comment.content = req.body.content; // Supposons que le contenu à mettre à jour soit envoyé dans le corps de la requête

//     // Sauvegarder le commentaire mis à jour dans la base de données
//     const updatedComment = await comment.save();

//     res.json(updatedComment);
//   } catch (error) {
//     console.error("Error updating comment:", error);
//     res.status(500).json({ message: "Error updating comment" });
//   }
// });


const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // Supposons que l'ID du commentaire soit envoyé dans le corps de la requête
  console.log("ID récupéré côté serveur :", id);

  // const userId = req.user.id; // Utilisez req.user.id pour récupérer l'ID de l'utilisateur
  const userId = "65df69dae61e837fa7eae0ec"; // Utilisez req.user.id pour récupérer l'ID de l'utilisateur

  try {
    // Trouver le commentaire par son ID
    const comment = await Comment.findById(id);

    // Vérifier si le commentaire existe
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Vérifier si l'utilisateur est l'auteur du commentaire
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Mettre à jour le contenu du commentaire
    comment.content = req.body.content; // Supposons que le contenu à mettre à jour soit envoyé dans le corps de la requête

    // Sauvegarder le commentaire mis à jour dans la base de données
    const updatedComment = await comment.save();

    // Renvoyer l'ID dans la réponse
    res.json({ updatedComment, id });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment" });
  }
});



  module.exports = {
    getAllComment,getCommentbyid,addComment,deleteComment,updateComment,deleteMyComment
  };