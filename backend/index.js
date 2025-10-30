const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
// ✅ Use environment variable for allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


const db = require("./models");

//Routers
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter);

const commentsRouter = require('./routes/Comments')
app.use("/comments", commentsRouter);

const usersRouter = require('./routes/Users')
app.use("/auth", usersRouter);

const likesRouter = require('./routes/Likes')
app.use("/likes", likesRouter);

// db.sequelize.sync().then(() => {
//     app.listen(3001, () => {
//         console.log("Server running on port 3001");
//     });
// });

db.sequelize.sync();
module.exports = app;
