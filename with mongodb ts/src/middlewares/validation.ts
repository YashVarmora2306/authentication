import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateRequest = (req: Request, res: Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array()[0] });
    }
    next()
}

export default validateRequest