const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken} = require('../middlewares/AuthMiddleware');

const {sign} = require('jsonwebtoken')

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    
    try {
        // Check if user already exists
        const existingUser = await Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }
        
        // Hash password and create user
        const hash = await bcrypt.hash(password, 10);
        await Users.create({
            username: username,
            password: hash,
        });
        
        res.json({ message: "SUCCESS" });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: "Signup failed" });
            }
        });

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: "Username or password required" });
        }

        // Find user
        const user = await Users.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" }); // ✅ return added
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(400).json({ error: "Wrong username and password combination" });
        }

        const accessToken = sign(
            {username: user.username, id: user.id }, 
            "importantSecret"
        );
        res.json({ 
            token: accessToken,
            username: user.username,
            id: user.id 
        });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Login failed" });
        }
    });

    // Get authenticated user info
    router.get('/auth', validateToken, (req, res) => {
        res.json(req.user);

    });

module.exports = router;