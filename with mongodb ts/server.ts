import app from "./src/app";
import connectDB from "./src/config/db";

(async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 5001
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Server failed to start", error);
        process.exit(1)
    }
})();