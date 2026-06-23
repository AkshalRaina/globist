import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reelsRouter from './routes/reels';
import { connectRedis } from './services/redis';
import { connectKafka } from './services/kafka';
import { startMediaProcessor } from './services/consumer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/reels', reelsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'reels-service', timestamp: new Date().toISOString() });
});

const startServer = async () => {
  try {
    await connectRedis();
    await connectKafka();
    await startMediaProcessor(); // Start background worker

    app.listen(PORT, () => {
      console.log(`🚀 Reels microservice running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
