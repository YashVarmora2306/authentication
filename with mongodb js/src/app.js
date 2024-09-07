import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "cors";
import { limiter, errorHandler } from "./middlewares/index.js";
import userRoutes from "./routes/index.js";
import logger from "./utils/logger.js";


const app = express()

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
}));
app.use(limiter);
app.use(mongoSanitize())
app.use(xss());
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


app.use('/user', userRoutes);

app.use(errorHandler);

export default app;