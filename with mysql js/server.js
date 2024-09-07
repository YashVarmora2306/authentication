import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import logger from "./src/utils/logger.js";

(async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        logger.log("Server failed to start", error);
        process.exit(1)
    }
})()