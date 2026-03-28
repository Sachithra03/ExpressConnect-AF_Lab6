const { authenticateToken } = require("../middleware/authMiddleware");
const express = require("express");
const multer = require("multer");
const {
    getAllPostsSorted,
    getPostsByAuthorSorted,
    getPostById,
    createPost,
    updatePostById,
    deletePostById
} = require("../data/postStore");
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
router.get("/view", authenticateToken, (req, res) => {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const pageSize = 5;
    const ownPosts = getPostsByAuthorSorted(req.user.username);
    const pagination = getPagination(page, ownPosts.length, pageSize);
    const paginatedPosts = ownPosts.slice(pagination.startIndex, pagination.endIndex);

    const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

    res.render("posts", {
        title: "My Posts",
        posts: paginatedPosts,
        viewingUser: req.user.username,
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
router.get("/add", authenticateToken, (req, res) => {
    res.render("addPost", {
        title: "Add New Post"
    });
});

// page - handle add form submit
router.post("/add", authenticateToken, upload.single("image"), (req, res) => {
    createPost({
        title: req.body.title,
        content: req.body.content,
        author: req.user.username,
        image: req.file ? "/uploads/" + req.file.filename : null
    });

    res.redirect("/posts/view");
});

// page - show edit form
router.get("/edit/:id", authenticateToken, (req, res) => {
    const post = getPostById(req.params.id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("editPost", {
        title: "Edit Post",
        post: post
    });
});

// page - handle edit form submit
router.post("/edit/:id", authenticateToken, (req, res) => {
    const post = getPostById(req.params.id);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    updatePostById(req.params.id, {
        title: req.body.title,
        content: req.body.content,
        author: req.user.username
    });

    res.redirect("/posts/view");
});

// page - delete post
router.post("/delete/:id", authenticateToken, (req, res) => {
    const deleted = deletePostById(req.params.id);

    if (!deleted) {
        return res.status(404).send("Post not found");
    }

    res.redirect("/posts/view");
});

// api - get all posts as JSON
router.get("/", (req, res) => {
    res.json(getAllPostsSorted());
});

// api - protected create post
router.post("/secure", authenticateToken, (req, res) => {
    const newPost = createPost({
        title: req.body.title,
        content: req.body.content,
        author: req.user.username,
        image: null
    });

    res.status(201).json({ message: "Post created", post: newPost });
});

// api - get post by id
router.get("/:id", (req, res) => {
    const post = getPostById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
});

// api - update post
router.put("/:id", authenticateToken, (req, res) => {
    const post = getPostById(req.params.id);

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = updatePostById(req.params.id, {
        title: req.body.title || post.title,
        content: req.body.content || post.content
    });

    res.json({ message: "Post Updated", post: updatedPost });
});

// api - delete post
router.delete("/:id", authenticateToken, (req, res) => {
    const deleted = deletePostById(req.params.id);

    if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted" });
});

module.exports = router;