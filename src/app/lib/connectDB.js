import mongoose from 'mongoose';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable inside .env file');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      dbName: 'KCDashboard',
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL, options).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
