import nodemailer, { Transporter } from "nodemailer";
import logger from "../utils/logger";

interface EmailOption {
    service: string;
    auth: {
        user: string;
        pass: string;
        };
}

const transporter: Transporter = nodemailer.createTransport({
    service: `${process.env.EMAIL_SERVICE}`,
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
}as EmailOption)

transporter.verify((error, success) => {
    if (error) {
        logger.error("Error with email transporter:", error);
    } else {
        logger.info("Email transporter is ready");
    }
})

export default transporter;