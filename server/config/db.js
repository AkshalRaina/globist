const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    // Use in-memory MongoDB for zero-setup development
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected (in-memory): ${uri}`);
    
    return mongod;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
};

module.exports = { connectDB, disconnectDB };
