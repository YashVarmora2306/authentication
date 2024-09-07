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