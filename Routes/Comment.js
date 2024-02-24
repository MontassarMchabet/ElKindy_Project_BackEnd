var express = require('express');
var router = express.Router();
const commentController = require("../Controllers/CommentController");



/* GET all comments */
router.get("/", commentController.getAllComment);

/* GET  comment by id */
router.get("/:id", commentController.getCommentbyid);

/* Add a new Comment */
router.post("/", commentController.addComment);

/* Update a Comment */
router.put("/:id", commentController.updateComment);

/* delete Comment */
router.delete("/delete/:id", commentController.deleteComment);

module.exports = router;
