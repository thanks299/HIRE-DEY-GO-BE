import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDb = async (req, res) => {
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (error) {
        res.status(500).json({ success: false, error: `Cant connect to DB, ${error}` })
    }
}

export default connectDb;