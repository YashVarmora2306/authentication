import { NextFunction, Request, Response } from "express";
import { forgotPasswordService, loginUserService, registerUserService, resetPasswordService, verifyEmailService } from "../services/auth";
import CustomError from "../utils/CustomError";
import { CustomRequest } from "../middlewares/auth";
import { IUser } from "../models/User";


export const registerUser = async (req: Request, res: Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        if (!req.file) {
            throw new CustomError("No profile picture uploaded", 400);
        }
        const user = await
            registerUserService({ username, email, password, fileBuffer: req.file.buffer })
        res.status(201).send(user);
        
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.statusCode || 500);
        next(error)
    }
}

export const loginUser = async (req: Request, res: Response, next:NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await loginUserService({ email, password });
        res.status(200).send(user);
        
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.statusCode || 500);
        next(error)
    }
}

export const verifyEmail = async (req:Request, res:Response, next:NextFunction) => {
    const { token } = req.params;
    try {
        const user = await verifyEmailService(token);
        res.status(200).send(user);
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.statusCode || 500);
        next(error)
    }
}


export const resetPassword = async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) res.status(400).send("User Not Found")
    const { _id } = req.user as IUser;
    const { password } = req.body;
    try {
        const user = await resetPasswordService({userId:_id, newPassword:password});
        res.status(200).send(user);
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.statusCode || 500);
        next(error)
    }
}

export const forgotPassword = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.body;
    try {
        const user = await forgotPasswordService(email);
        res.status(200).send(user);
    } catch (error) {
        const customError = error as CustomError;
        res.status(customError.statusCode || 500);
        next(error)
    }
}


export const getProfile = (req: CustomRequest, res: Response, next:NextFunction) => {
    if (req.user) {

        const { _id, username, email, profilePicture } = req.user;
        try {
            res.status(200).send({
                _id,
                username,
                email,
                profilePicture,
            });
        } catch (error) {
            const customError = error as CustomError;
            res.status(customError.statusCode || 500);
            next(error)
        }
    } else {
        res.status(400).send("User Not Found")
    };
}

