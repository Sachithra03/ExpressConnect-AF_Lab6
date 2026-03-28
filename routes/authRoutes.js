const express = require("express");
const jwt = require("jsonwebtoken");
const { getTokenFromRequest } = require("../middleware/authMiddleware");

const router = express.Router();
const SECRET_KEY = "mysecretkey";

let users = [
    {
        id: 1,
        username: "admin",
        password: "1234"
    },
    {
        id: 2,
        username: "user",
        password: "1234"
    }
];

router.get("/login", (req, res) => {
    const token = getTokenFromRequest(req);

    if (token) {
        return res.redirect("/posts/view");
    }

    res.render("login", { title: "Login" });
});

router.post("/login", (req, res) => {
    const {username, password} = req.body;

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if(!user){
        if (req.accepts("html")) {
            return res.status(401).render("login", {
                title: "Login",
                error: "Invalid username or password"
            });
        }

        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    if (req.accepts("html")) {
        return res.redirect("/posts/view");
    }

    res.json({ message: "Login Successful", token });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");

    if (req.accepts("html")) {
        return res.redirect("/login");
    }

    res.json({ message: "Logout successful" });
});

module.exports = router;