import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../helpers/generateToken";
import { CustomRequest } from "../middlewares/auth";

export const registerUser = async (req: Request, res: Response) => { 
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).send("User already exists");
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user.id.toString());
        res.status(201).send({
            id: user.id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        const matchedPassword = await user?.matchPassword(password) ?? false;
        if (user && matchedPassword) {
            const token = generateToken(user.id.toString());
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                token,
            });
        } else {
            res.status(401).send("Invalid email or password");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const getProfile = (req: CustomRequest, res: Response) => {
    if (req.user) {
        res.status(200).send({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        })
    } else {
        res.status(400).send("User Not Found")
    };
}
