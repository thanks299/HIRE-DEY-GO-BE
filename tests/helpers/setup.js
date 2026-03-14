import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/config/env.js";

let connected = false;

export const connectTestDb = async () => {
  if (connected || mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  connected = true;
};

export const isMongoAvailable = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    return true;
  } catch {
    return false;
  }
};