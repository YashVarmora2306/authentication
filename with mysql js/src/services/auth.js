import User from "../models/User.js";
import { generateToken, handleUpload, sendMail } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";

export const registerUserService = async ({
    username, email, password, fileBuffer
}) => {
    const userExists = await User.findOne({ where: { email } });
    if (userExists && userExists.isVerified) throw new CustomError("User already exists", 400)

    if (userExists && !userExists.isVerified) {
        const token = generateToken(userExists.id);
        await sendMail.sendVerificationEmail(userExists.username, userExists.email, token)
        return ({
            success: true,
            data: {
                id: userExists.id,
                username: userExists.username,
                email: userExists.email,
                profilePicture: userExists.profilePicture,
            },
            message: "Please check your mail to verify your account."
        });
    }

    const profilePicture = await handleUpload(fileBuffer)

    const user = await User.create({ username, email, password, profilePicture });
    const token = generateToken(user.id);

    await sendMail.sendVerificationEmail(user.username, user.email, token)

    return ({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        },
        message: "User registered successfully. Please check your mail to verify your account."
    });
}

export const loginUserService = async({
    email, password
}) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new CustomError("Incorrect email or password. Please try again.", 400);

    const matchedPassword = await user.matchPassword(password)
    if (!matchedPassword) throw new CustomError("Incorrect email or password. Please try again.", 400);

    if (!user.isVerified) {
        const token = generateToken(user.id);
        await sendMail.sendVerificationEmail(user.username, email, token)
        return {
            success: false,
            message: "Email not verified. Please check your inbox to verify your email."
        }
    }
    
    const token = generateToken(user.id);

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

        const user = await User.findByPk(decode.id, { attributes: { exclude: ['password'] } });

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


export const resetPasswordService = async (userId, newPassword) => {
   const user = await User.findByPk(userId);
    if (!user) {
        throw new CustomError("Invalid Token", 400);
    }

    user.password = newPassword;
    await user.save();

    await sendMail.sendPasswordChangeConfirmationEmail(user.username, user.email)

    return ({
        success: true,
        message: "Password Changed Successfully",
    });
}

export const forgotPasswordService = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new CustomError("Invalid Token", 400);
    }

    const resetToken = generateToken(user.id);
    await sendMail.sendForgotPasswordLinkEmail(user.username, email, resetToken);

    return {
        success: true,
        resetUrl: `http://localhost:${process.env.PORT}/user/auth/resetPassword?token=${resetToken}`,
        message: "Password reset link has been sent to your email."
    };

}