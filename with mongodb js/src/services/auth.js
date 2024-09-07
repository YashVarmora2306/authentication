import User from "../models/User.js";
import { generateToken, handleUpload, sendMail } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

export const registerUserService = async ({
    username, email, password, fileBuffer
}) => {
    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) throw new CustomError("User already exists", 400)
    
    if (userExists && !userExists.isVerified) {
        const token = generateToken(userExists._id);
        await sendMail.sendVerificationEmail(userExists.username, userExists.email, token)
        return ({
            success: true,
            data: {
                id: userExists._id,
                username: userExists.username,
                email: userExists.email,
                profilePicture: userExists.profilePicture,
            },
            message: "Please check your mail to verify your account."
        });
    }

    const profilePicture = await handleUpload(fileBuffer)

    const user = await User.create({ username, email, password, profilePicture });

    const token = generateToken(user._id);

    await sendMail.sendVerificationEmail(user.username, user.email, token)

    return ({
        success: true,
        data: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        },
        message: "User registered successfully. Please check your mail to verify your account."
    });
}

export const loginUserService = async ({
    email, password
}) => {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("Incorrect email or password. Please try again.", 400);

    const matchedPassword = await user.matchPassword(password)
    if (!matchedPassword) throw new CustomError("Incorrect email or password. Please try again.", 400);

    if (!user.isVerified) {
        const token = generateToken(user._id);
        await sendMail.sendVerificationEmail(user.username, email, token)
        return {
            success: false,
            message: "Email not verified. Please check your inbox to verify your email."
        }
    }
    
    const token = generateToken(user._id);

    await sendMail.sendSuccessEmail(user.username, email)

    return ({
        success: true,
        token,
        message: "User logged in successfully",
    });
}

export const verifyEmailService = async (token) => {
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decode.id).select("-password");

        if (!user) {
            throw new CustomError("Invalid Token", 400);
        }

        if (user.isVerified) {
            throw new CustomError("Email is already verified", 400);
        }

        user.isVerified = true;
        await user.save();
        return {
            success: true,
            message: "Email verified successfully! You can now log in.",
        }
    } catch (error) {
        throw new CustomError("Invalid or expired Token", 400);
    }
}