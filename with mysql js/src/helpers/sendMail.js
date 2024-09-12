import mailer from "../config/mailer.js"
import { getForgotPasswordEmailTemplate, getLoginSuccessEmailTemplate, getPasswordChangedEmailTemplate, getVerificationEmailTemplate } from "../utils/emailTemplates.js"

const sendVerificationEmail = async (username, email, token) => {
    const verificationUrl = `http://localhost:${process.env.PORT}/user/auth/verify-email/${token}`

    const message = getVerificationEmailTemplate(username, verificationUrl)

    await mailer.sendMail({
        to: email,
        subject: "Verify your email to use Authify",
        html: message,
    })
}

const sendSuccessEmail = async (username,email) => {
    
    const message = getLoginSuccessEmailTemplate(username)

    await mailer.sendMail({
        to: email,
        subject: "Login successful",
        html: message,
    })
}

const sendPasswordChangeConfirmationEmail = async (username, email) => {

    const message = getPasswordChangedEmailTemplate(username);

    await mailer.sendMail({
        to: email,
        subject: 'Password Changed Successfully',
        html: message,
    });
}

const sendForgotPasswordLinkEmail = async (username, email, token) => {
    const resetUrl = `http://localhost:${process.env.PORT}/user/auth/resetPassword?token=${token}`

    const message = getForgotPasswordEmailTemplate(username, resetUrl)

    await mailer.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: message,
    })
}

export default { sendVerificationEmail, sendSuccessEmail, sendPasswordChangeConfirmationEmail, sendForgotPasswordLinkEmail }