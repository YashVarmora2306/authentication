import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        logger.info("MongoDB Connected");
    } catch (err) {
        logger.error("MongoDB connection error", err);
        process.exit(1);

    }
}

export default connectDB;