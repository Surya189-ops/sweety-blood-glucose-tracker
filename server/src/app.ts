import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import readingsRoutes from './routes/readings.routes.js';
import reportsRoutes from './routes/reports.routes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'Sweety',
    message: 'Sweety API is running.',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/readings', readingsRoutes);
app.use('/api/reports', reportsRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

export default app;
