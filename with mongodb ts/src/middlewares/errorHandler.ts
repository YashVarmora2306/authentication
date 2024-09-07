import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

interface Error {
    name: string;
    message: string;
    stack?: string;
}

const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    logger.error(`${err.name}: ${err.message}`);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).send({
        success: false,
        message: err.message || "Internal server Error",
    })
}

export default errorHandler;