import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.name}: ${err.message}`);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).send({
        success: false,
        message: err.message || "Internal Server Error",
    })
}

export default errorHandler;