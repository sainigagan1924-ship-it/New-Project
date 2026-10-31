import mongoose from 'mongoose';
import { config } from '../config/index.js';

let isMongoConnected = false;

export async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500, // fast failover if no local mongod
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`ℹ️ MongoDB connection not available at ${config.mongoUri}.`);
    console.log(`⚡ Seamlessly switching to StudyTube High-Performance Local In-Memory Store.`);
    isMongoConnected = false;
  }
}

export function isDbConnected() {
  return isMongoConnected;
}

