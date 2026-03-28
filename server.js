const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { getTokenFromRequest, SECRET_KEY } = require("./middleware/authMiddleware");
const { getAllPostsSorted } = require("./data/postStore");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    const token = getTokenFromRequest(req);

    if (!token) {
        res.locals.currentUser = null;
        return next();
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.locals.currentUser = null;
            return next();
        }

        req.user = user;
        res.locals.currentUser = user;
        next();
    });
});

// handlebars setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// static uploads
app.use("/uploads", express.static("uploads"));

// home page
app.get("/", (req, res) => {
    const posts = getAllPostsSorted();

    res.render("home", {
        title: "ExpressConnect Home",
        posts
    });
});

// routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);

app.listen(port, () => {
    console.log(`ExpressConnect server is listening on port ${port}`);
});