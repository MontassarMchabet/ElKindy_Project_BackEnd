var express = require('express');
var router = express.Router();
const commentController = require("../Controllers/CommentController");




/* GET all comments */
router.get("/all", commentController.getAllComment);

/* GET  comment by id */
router.get("/:id", commentController.getCommentbyid);

/* Add a new Comment */
router.post("/add/event/:eventId", commentController.addComment);

/* Update a Comment */
router.put("/update/:id", commentController.updateComment);

/* delete Comment */
router.delete("/delete/:id", commentController.deleteComment);

module.exports = router;
