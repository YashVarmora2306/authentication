import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const user = await User.findById(decoded.id).select("-password");
            req.user = user;
            next();
        } catch (error) {
            
            res.status(401).send("Not authorized, token failed")
        }
    }
    if (!token) {
        res.status(401).send("Not authorized, no token")
    }
}

export default protect;