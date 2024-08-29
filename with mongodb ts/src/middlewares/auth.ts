import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"
import { NextFunction, Request, Response } from "express"

export interface CustomRequest extends Request {
    user?: IUser | null;
}
interface JwtPayload {
    id: string;
}

const protect = async (req:CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
           
            const user = await User.findById(decoded.id).select("-password");
            
            req.user = user
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