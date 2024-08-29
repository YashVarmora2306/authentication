import { body } from "express-validator";

export const registerUserValidator = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    body('email')
        .isEmail()
        .withMessage('Invalid email'),
    body('password')
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[0-9a-zA-Z@$!%*#?&]{6,}$/)
        .withMessage(
            "Password  must contain at least one uppercase letter, one lowercase letter, one special character and one digit"
        ),
]

export const loginUserValidator = [
    body('email')
        .isEmail()
        .withMessage('Invalid email'),
    body('password')
        .notEmpty()
        .withMessage("Password is required"),
]