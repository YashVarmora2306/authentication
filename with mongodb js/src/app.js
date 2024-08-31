import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/index.js";


const app = express()

app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRoutes);

export default app;