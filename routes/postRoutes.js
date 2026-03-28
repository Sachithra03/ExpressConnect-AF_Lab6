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

let nextPostId = 2;

function getPagination(page, totalItems, pageSize) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        page: safePage,
        totalPages,
        startIndex,
        endIndex,
        hasPrev: safePage > 1,
        hasNext: safePage < totalPages,
        prevPage: safePage - 1,
        nextPage: safePage + 1
    };
}

// page - view all posts
router.get("/view", (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const pageSize = 5;
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
    const pagination = getPagination(page, sortedPosts.length, pageSize);
    const paginatedPosts = sortedPosts.slice(pagination.startIndex, pagination.endIndex);

    const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

    res.render("posts", {
        title: "All Posts",
        posts: paginatedPosts,
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        hasPrev: pagination.hasPrev,
        hasNext: pagination.hasNext,
        prevPage: pagination.prevPage,
        nextPage: pagination.nextPage,
        pageNumbers
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
        id: nextPostId++,
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
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
    res.json(sortedPosts);
});

// api - protected create post
router.post("/secure", authenticateToken, (req, res) => {
    const newPost = {
        id: nextPostId++,
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