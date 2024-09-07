import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"
import { NextFunction, Request, Response } from "express"

export interface CustomRequest extends Request {
    user?: IUser | null;
}
interface JwtPayload {
    id: string;
}

const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, token missing');
    }
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`) as JwtPayload;

        const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });

        req.user = user
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed")
    }
}

export default protect;