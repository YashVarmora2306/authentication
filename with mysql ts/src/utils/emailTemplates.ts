export const getVerificationEmailTemplate = (username: string, verificationUrl: string) => {
    return `
        <h1>Hello, ${username}</h1>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href= "${verificationUrl}" target="_blank">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
    `;
}

export const getLoginSuccessEmailTemplate = (username:string) => {
    return `
    <h1>Hello, ${username}</h1>
    <p>Welcome back! You have successfully logged in.</p>
    `
}

export const getPasswordChangedEmailTemplate = (username: string) => {
    return `
    <h1>Hello, ${username}</h1>
    <p>Your password has been successfully changed.</p>
    <p>If you did not make this change, please contact support immediately.</p>
`
};

export const getForgotPasswordEmailTemplate = (username: string, resetLink: string) => {
    return `
    <h1>Hello, ${username}</h1>
    <p>We received a request to reset your password. To proceed, please click the link below:</p>
    <p><a href="${resetLink}" target="_blank">Reset Your Password</a></p>
    <p>If you didn't request this password reset, you can ignore this email.</p>
    `;
}