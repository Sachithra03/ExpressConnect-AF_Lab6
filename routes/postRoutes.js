const authenticateToken = require("../middleware/authMiddleware");
const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// temporary data
let posts = [
    {
        id: 1,
        title: "First post",
        content: "This is the content of the first post.",
        author: "Admin",
        image: null
    }
];

// page - view all posts
router.get("/view", (req, res) => {
    res.render("posts", {
        title: "All Posts",
        posts: posts
    });
});

// page - show add form
router.get("/add", (req, res) => {
    res.render("addPost", {
        title: "Add New Post"
    });
});

// page - handle add form submit
router.post("/add", upload.single("image"), (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        image: req.file ? "/uploads/" + req.file.filename : null
    };

    posts.push(newPost);
    res.redirect("/posts/view");
});

// page - show edit form
router.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("editPost", {
        title: "Edit Post",
        post: post
    });
});

// page - handle edit form submit
router.post("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    post.title = req.body.title;
    post.content = req.body.content;
    post.author = req.body.author;

    res.redirect("/posts/view");
});

// page - delete post
router.post("/delete/:id", (req, res) => {
    const index = posts.findIndex(p => p.id == req.params.id);

    if (index === -1) {
        return res.status(404).send("Post not found");
    }

    posts.splice(index, 1);
    res.redirect("/posts/view");
});

// api - get all posts as JSON
router.get("/", (req, res) => {
    res.json(posts);
});

// api - protected create post
router.post("/secure", authenticateToken, (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.user.username,
        image: null
    };

    posts.push(newPost);
    res.status(201).json({ message: "Post created", post: newPost });
});

// api - get post by id
router.get("/:id", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
});

// api - update post
router.put("/:id", authenticateToken, (req, res) => {
    const post = posts.find(p => p.id == req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    res.json({ message: "Post Updated", post });
});

// api - delete post
router.delete("/:id", authenticateToken, (req, res) => {
    const index = posts.findIndex(p => p.id == req.params.id);

    if (index == -1) {
        return res.status(404).json({ message: "Post not found" });
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted" });
});

module.exports = router;