import mailer from "../config/mailer";
import { getForgotPasswordEmailTemplate, getLoginSuccessEmailTemplate, getPasswordChangedEmailTemplate, getVerificationEmailTemplate } from "../utils/emailTemplates";

const sendVerificationEmail = async (username: string, email: string, token: string) => {
    const verificationUrl = `http://localhost:${process.env.PORT}/user/auth/verify-email/${token}`

    const message = getVerificationEmailTemplate(username, verificationUrl)

    await mailer.sendMail({
        to: email,
        subject: "Verify your email to use Authify",
        html: message,
    })
}

const sendSuccessEmail = async (username: string, email: string) => {
    
    const message = getLoginSuccessEmailTemplate(username)

    await mailer.sendMail({
        to: email,
        subject: "Login successful",
        html: message,
    })
}

const sendPasswordChangeConfirmationEmail = async (username: string, email: string) => {

    const message = getPasswordChangedEmailTemplate(username);

    await mailer.sendMail({
        to: email,
        subject: 'Password Changed Successfully',
        html: message,
    });
}

const sendForgotPasswordLinkEmail = async (username:string, email:string, token:string) => {
    const resetUrl = `http://localhost:${process.env.PORT}/user/auth/resetPassword?token=${token}`

    const message = getForgotPasswordEmailTemplate(username, resetUrl)

    await mailer.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: message,
    })
}

export default { sendVerificationEmail, sendSuccessEmail, sendPasswordChangeConfirmationEmail, sendForgotPasswordLinkEmail }