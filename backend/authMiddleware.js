// authMiddleware.js
import jwt from "jsonwebtoken";

/**
 * isAdmin — checks the custom header x-admin-key
 * No login flow for admin; uses a shared secret key.
 */
export const isAdmin = (req, res, next) => {
    const adminKey = req.headers["x-admin-key"];

    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ message: "Admin access denied" });
    }

    next();
};

/**
 * verifyToken — validates JWT for employee routes
 * Token must be sent as: Authorization: Bearer <token>
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: employee._id }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};