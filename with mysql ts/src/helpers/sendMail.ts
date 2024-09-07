import mailer from "../config/mailer";
import { getLoginSuccessEmailTemplate, getVerificationEmailTemplate } from "../utils/emailTemplates";

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

export default {sendVerificationEmail, sendSuccessEmail}