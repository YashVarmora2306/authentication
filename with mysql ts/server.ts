import app from "./src/app";
import connectDB from "./src/config/db";
import logger from "./src/utils/logger";


(async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 5001
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error("Server failed to start", error);
        process.exit(1)
    }
})();