import mailer from "../config/mailer.js"
import { getLoginSuccessEmailTemplate, getVerificationEmailTemplate } from "../utils/emailTemplates.js"

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

export default {sendVerificationEmail,sendSuccessEmail}