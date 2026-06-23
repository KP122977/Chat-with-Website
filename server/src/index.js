import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crawlRouter from './routes/crawl.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crawl', crawlRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Chat with Website API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});