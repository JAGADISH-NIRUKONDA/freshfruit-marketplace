import mongoose from 'mongoose';

export const connectDB = async (uri = process.env.MONGODB_URI) => {
  const primaryURI = uri || 'mongodb://127.0.0.1:27017/freshfarm_connect';
  const fallbackURI = 'mongodb://127.0.0.1:27017/freshfarm_connect';

  try {
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (primaryURI !== fallbackURI) {
      console.warn(`[MongoDB] Primary connection failed (${error.message}). Falling back to local MongoDB...`);
      try {
        const conn = await mongoose.connect(fallbackURI, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected via fallback to local database: ${conn.connection.name} at ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`[MongoDB] Fallback connection error: ${fallbackError.message}`);
        throw error;
      }
    }
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

