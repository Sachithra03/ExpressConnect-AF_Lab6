const authenticateToken = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

//temporary data
let posts =[
    {
        id: 1,
        title: "First post",
        content: "This is the content of the first post.",
        author: "Admin"
    }
];

// get all posts
router.get("/view", (req, res) => {
    res.render("posts", {
        title: "All Posts",
        posts: posts
    });
});

//add post form
router.get("/add", (req, res) => {
    res.render("addPost", {
        title: "Add New Post" 
    });
});

//create a post
router.post("/add", (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    posts.push(newPost);
    res.redirect("/posts/view");
});

//get all posts as json
router.get("/", (req, res) => {
    res.json(posts);
});

//protected create post
router.post("/secure", authenticateToken, (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.user.username
    };
    posts.push(newPost);
    res.status(201).json({ message: "Post created", post: newPost });
});

//get post by id
router.get("/:id", (req, res) => {
    const post = posts.find( p => p.id == req.params.id);

    if(!post){
        return res.status(404).json({ message: "Post not found"});
    }

    res.json(post);
});

//update
router.put("/:id", authenticateToken, (req, res) => {
    const post = posts.find( p => p.id == req.params.id);

    if(!post){
        return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content

    res.json({ message: "Post Updated", post });
});

//delete
router.delete("/:id", authenticateToken, (req, res) => {
    const index = posts.findIndex(p => p.id == req.params.id);

    if(index == -1){
        return res.status(404).json({ message: "Post not found"});
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted "});
});



module.exports = router;