const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { where } = require("sequelize");

const { validateToken } = require ("../middlewares/AuthMiddleware")

router.get("/", validateToken, async (req, res) => {
    try{
        const listOfPosts = await Posts.findAll({ include: [Likes] })
        
        const likedPosts = await Likes.findAll({where: { UserId: req.user.id }})
        res.json({listOfPosts: listOfPosts,  likedPosts: likedPosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/byId/:id', async (req, res) => {
    const id  = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

// router.get('/byuserId/:userId', async (req, res) => {
//     const id  = req.params.userId;
//     const likedPosts = await Posts.findAll({ where: { UserId: id }});
//     res.json(listOfPosts);
// });

router.get('/byUserId/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const posts = await Posts.findAll({ 
            where: { UserId: userId },
            include: [Likes]
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user posts" });
    }
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post); 
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId
    try {
        await Posts.destroy({
            where: { 
                id: Number(postId) 
            },
        });
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete post" });
    }

})

module.exports = router;