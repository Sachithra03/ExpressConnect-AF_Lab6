const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handlebars setup
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.send("ExpressConnect server is running.");
});

//auth routes
app.use("/", authRoutes);
app.use("/posts", postRoutes);


app.listen(port, () => {
    console.log(`ExpressConnect server is listening on port ${port}`);
});