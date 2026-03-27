const express = require('express');
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middleware/authMiddleware');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//temporary data
let posts =[
    {
        id: 1,
        title: "First post",
        content: "This is the content of the first post.",
        author: "Admin"
    }
];

app.get("/", (req, res) => {
    res.send("ExpressConnect server is running.");
});

//auth routes
app.use("/", authRoutes);

// get all posts
app.get("/posts", (req, res) => {
    res.json(posts);
});

//create a post
app.post("/posts", (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    posts.push(newPost);
    res.status(201).json({ message: "Post created", post: newPost });
});

//get post by id
app.get("/posts/:id", (req, res) => {
    const post = posts.find( p => p.id == req.params.id);

    if(!post){
        return res.status(404).json({ message: "Post not found"});
    }

    res.json(post);
});

//update
app.put("/posts/:id", (req, res) => {
    const post = posts.find( p => p.id == req.params.id);

    if(!post){
        return res.status(404).json({ message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content

    res.json({ message: "Post Updated", post });
});

//delete
app.delete("/posts/:id", (req, res) => {
    const index = posts.findIndex(p => p.id == req.params.id);

    if(index == -1){
        return res.status(404).json({ message: "Post not found"});
    }

    posts.splice(index, 1);
    res.json({ message: "Post deleted "});
})

//protected route
app.post("/secure-posts", authenticateToken, (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        authot: req.user.username
    };

    posts.push(newPost);

    res.status(201).json({
        message: "Protected post created.",
        post: newPost

    });
});

app.listen(port, () => {
    console.log(`ExpressConnect server is listening on port ${port}`);
});