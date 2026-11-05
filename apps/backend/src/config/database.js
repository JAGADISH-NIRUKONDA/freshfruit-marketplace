import mongoose from 'mongoose';

export const connectDB = async (uri = process.env.MONGODB_URI) => {
  const mongoURI = uri || 'mongodb://127.0.0.1:27017/freshfarm_connect';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed.');
  } catch (error) {
    console.error(`[MongoDB] Disconnect error: ${error.message}`);
  }
};

export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  return {
    status: states[readyState] || 'unknown',
    readyState,
    databaseName: mongoose.connection.name || 'freshfarm_connect',
    host: mongoose.connection.host || '127.0.0.1',
  };
};

