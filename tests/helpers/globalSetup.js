import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/config/env.js";

export const setup = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
  }
};

export const teardown = async () => {
  await mongoose.connection.close();
};