const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecretkey";

function getTokenFromRequest(req) {
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader && authHeader.split(" ")[1];

    return bearerToken || req.cookies?.token || null;
}

function respondUnauthorized(req, res, statusCode, message) {
    if (req.accepts("html")) {
        return res.redirect("/login");
    }

    return res.status(statusCode).json({ message });
}

function authenticateToken(req, res, next) {
    const token = getTokenFromRequest(req);

    if (!token) {
        return respondUnauthorized(req, res, 401, "Access token required");
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return respondUnauthorized(req, res, 403, "Invalid or expired token");
        }

        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
    getTokenFromRequest,
    SECRET_KEY
};