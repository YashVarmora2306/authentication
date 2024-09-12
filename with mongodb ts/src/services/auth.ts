import User from "../models/User";
import { generateToken, handleUpload, sendMail } from "../helpers";
import CustomError from "../utils/CustomError";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

interface RegisterUserServiceInput {
    username: string;
    email: string;
    password: string;
    fileBuffer: Buffer;
}

interface RegisterUserServiceOutput {
    success: boolean;
    data: {
        id: string;
        username: string;
        email: string;
        profilePicture: string;
    };
    message: string;
}

interface LoginUserServiceInput {
    email: string;
    password: string;
}

interface LoginUserServiceOutput {
    success: boolean;
    token?: string;
    message: string;
}
interface VerifyEmailServiceOutput {
    success: boolean;
    message: string;
}
interface JwtPayload {
    id: string;
}

interface ResetPasswordServiceInput {
    userId: ObjectId;
    newPassword: string;
}

interface ResetPasswordServiceOutput {
    success: boolean;
    message: string;
}

interface ForgotPasswordServiceOutput {
    success: boolean;
    resetUrl: string
    message: string;
}

export const registerUserService = async ({ username, email, password, fileBuffer }: RegisterUserServiceInput): Promise<RegisterUserServiceOutput> => {
    const userExists = await User.findOne({
        email
    });
    if (userExists && userExists.isVerified) throw new CustomError("User already exists", 400)

    if (userExists && !userExists.isVerified) {
        const token = generateToken(userExists._id.toString());
        await sendMail.sendVerificationEmail(userExists.username, userExists.email, token)
        return ({
            success: true,
            data: {
                id: userExists._id.toString(),
                username: userExists.username,
                email: userExists.email,
                profilePicture: userExists.profilePicture,
            },
            message: "Please check your mail to verify your account."
        });
    }

    const profilePicture = await handleUpload(fileBuffer)
    const user = await User.create({ username, email, password, profilePicture });
    const token = generateToken(user._id.toString());

    await sendMail.sendVerificationEmail(user.username, user.email, token)

    return ({
        success: true,
        data: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        },
        message: "User registered successfully. Please check your mail to verify your account."
    });
}


export const loginUserService = async ({
    email, password
}: LoginUserServiceInput): Promise<LoginUserServiceOutput> => {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("Incorrect email or password. Please try again.", 400);

    const matchedPassword = await user.matchPassword(password)
    if (!matchedPassword) throw new CustomError("Incorrect email or password. Please try again.", 400);

    if (!user.isVerified) {
        const token = generateToken(user._id.toString());
        await sendMail.sendVerificationEmail(user.username, email, token)
        return {
            success: false,
            message: "Email not verified. Please check your inbox to verify your email."
        }
    }

    const token = generateToken(user._id.toString());

    await sendMail.sendSuccessEmail(user.username, email)

    return ({
        success: true,
        token,
        message: "User logged in successfully",
    });
}


export const verifyEmailService = async (token: string): Promise<VerifyEmailServiceOutput> => {
    try {
        const decode = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`) as JwtPayload;
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

export const resetPasswordService = async ({userId, newPassword}:ResetPasswordServiceInput):Promise<ResetPasswordServiceOutput> => {
    const user = await User.findById(userId);
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


export const forgotPasswordService = async (email:string):Promise<ForgotPasswordServiceOutput> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("Invalid Token", 400);
    }

    const resetToken = generateToken(user._id.toString());
    await sendMail.sendForgotPasswordLinkEmail(user.username, email, resetToken);

    return {
        success: true,
        resetUrl: `http://localhost:${process.env.PORT}/user/auth/resetPassword?token=${resetToken}`,
        message: "Password reset link has been sent to your email."
    };

}