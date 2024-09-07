import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import userRoutes from "./routes/index";
import { errorHandler, limiter } from "./middlewares";
import logger from "./utils/logger";


const app = express()

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    optionsSuccessStatus: 200,
}));
app.use(limiter);
app.use(mongoSanitize())
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined", {
        stream: {
            write: message => logger.info(message.trim())
        }
    }));
}
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.use(errorHandler);

export default app;