const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB connected: Cloud`);
      return null;
    }

    // Configure MongoMemoryServer to use /tmp on Vercel (read-only filesystem workaround)
    if (process.env.VERCEL) {
      process.env.MONGOMS_DOWNLOAD_DIR = '/tmp';
      process.env.MONGOMS_PREFER_GLOBAL_PATH = 'true';
    }

    // Use in-memory MongoDB for zero-setup development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected (in-memory): ${uri}`);
    
    return mongod;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (!process.env.VERCEL) process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
};

module.exports = { connectDB, disconnectDB };
