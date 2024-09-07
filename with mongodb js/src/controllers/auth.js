import { registerUserService, loginUserService, verifyEmailService } from "../services/auth.js";

export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;
    try{
        const user = await registerUserService({ username, email, password, fileBuffer: req.file.buffer });
        res.status(201).send(user);
    } catch (error) {
        res.status(error.statusCode || 500);
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await loginUserService({ email, password });
        res.status(200).send(user);
    } catch (error) {
        res.status(error.statusCode || 500);
        next(error)
    }
}

export const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    try{
        const user = await verifyEmailService(token);
        res.status(200).send(user);
    } catch (error) {
        res.status(error.statusCode || 500);    
        next(error)
    }
}

export const getProfile = (req, res, next) => {
    const { _id, username, email, profilePicture } = req.user;
    try{    
    res.status(200).send({
            _id,
            username,
            email,
            profilePicture,
    });
    } catch (error) {
        res.status(error.statusCode || 500);
        next(error)
    }
}