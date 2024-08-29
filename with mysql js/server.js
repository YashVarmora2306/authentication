import app from "./src/app.js";
import connectDB from "./src/config/db.js";

(async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log("Server failed to start", error);
        process.exit(1)
    }
})()