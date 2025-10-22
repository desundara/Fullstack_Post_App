const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require('../middlewares/AuthMiddleware');

// Get all comments for a specific post
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    try {
        const comments = await Comments.findAll({ where: { postId: Number(postId) } });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

// Add a new comment
router.post("/", validateToken, async (req, res) => {
    try {
        const { commentText, postId } = req.body;
        const username = req.user.username; // Get username from token

        if (!commentText || !postId) {
            return res.status(400).json({ error: "Comment text and post ID are required" });
        }

        const comment = await Comments.create({
            commentText,
            postId: Number(postId), // Make sure postId is a number
            username,
        });

        res.json(comment);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create comment" });
        }
});

// Delete a comment
router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId;

    try {
        await Comments.destroy({
            where: { id: Number(commentId) },
        });
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

module.exports = router;
