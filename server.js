import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import { PORT } from "./src/config/env.js";

const startServer = async() => {
    try {
        await connectDb();
        console.log("Successfully connected to DB");

        app.listen(PORT, () => {
            console.log(`Server running on localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

await startServer()