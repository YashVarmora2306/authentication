import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.id).select("-password");

        req.user = user;

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed")
    }
}

export default protect;