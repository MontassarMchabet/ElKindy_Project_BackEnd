const comment = require('../Models/Comment');
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');

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

//   const addComment = asyncHandler(async (req, res) => {
//     try {
//         const newComment = await comment.create(req.body);
//         res.json(newComment);
//     } catch (error) {
//         throw new Error(error);
//     }
// });
// const addComment = asyncHandler(async (req, res) => {
//   try {
//       // Extraire l'identifiant de l'événement de l'URL
//       const eventId = req.params.eventId;

//       // Vérifier si l'identifiant de l'événement est valide
//       if (!mongoose.Types.ObjectId.isValid(eventId)) {
//           return res.status(400).json({ message: "Invalid event ID" });
//       }

//       // Récupérer l'ID de l'utilisateur connecté
//       // const userId = req.user._id;
      
//       // const userId1 = "65df69dae61e837fa7eae0ec";
//       // console.log("useeeeeeeeer",userId)
//       const userId = req.user.userId;
      
//       // Créer un nouvel objet de commentaire avec l'identifiant de l'événement et l'ID de l'utilisateur connecté
//       const newComment = await comment.create({
//           event: eventId, // Associer le commentaire à l'événement
//           user: userId,   // Associer le commentaire à l'utilisateur connecté
//           comment: req.body.comment,
//           date: Date.now()
//       });

//       // Répondre avec le nouveau commentaire créé
//       res.json(newComment);
//   } catch (error) {
//       // Gérer les erreurs
//       throw new Error(error);
//   }
// });
const addComment = asyncHandler(async (req, res) => {
  try {
      // Extraire l'identifiant de l'événement de l'URL
      const eventId = req.params.eventId;

      // Vérifier si l'identifiant de l'événement est valide
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ message: "Invalid event ID" });
      }

      // Récupérer l'ID de l'utilisateur connecté
      // const userId = req.user._userId;
    const userId = "65df69dae61e837fa7eae0ec";
      
      // Créer un nouvel objet de commentaire avec l'identifiant de l'événement et l'ID de l'utilisateur connecté
      const newComment = await comment.create({
          event: eventId, // Associer le commentaire à l'événement
          user: userId,   // Associer le commentaire à l'utilisateur connecté
          comment: req.body.comment,
          date: Date.now()
      });

      // Répondre avec le nouveau commentaire créé
      res.json(newComment);
  } catch (error) {
      // Gérer les erreurs
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment" });
  }
});

// const addComment = asyncHandler(async (req, res) => {
//   try {
//     // Extraire l'identifiant de l'événement de l'URL
//     const eventId = req.params.eventId;

//     // Vérifier si l'identifiant de l'événement est valide
//     if (!mongoose.Types.ObjectId.isValid(eventId)) {
//       return res.status(400).json({ message: "Invalid event ID" });
//     }

//     // Récupérer l'ID de l'utilisateur connecté
//     // const userId = req.user._id;
//     const userId = "65df69dae61e837fa7eae0ec";

//     // Créer un nouvel objet de commentaire avec l'identifiant de l'événement et l'ID de l'utilisateur connecté
//     const newComment = await Comment.create({
//       event: eventId, // Associer le commentaire à l'événement
//       user: userId,   // Associer le commentaire à l'utilisateur connecté
//       comment: req.body.comment,
//       date: Date.now()
//     });

//     // Répondre avec le nouveau commentaire créé
//     res.json(newComment);
//   } catch (error) {
//     // Gérer les erreurs
//     console.error("Error adding comment:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


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