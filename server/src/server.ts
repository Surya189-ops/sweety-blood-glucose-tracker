import 'dotenv/config';
import app from './app.js';
import { prisma } from './prisma.js';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sweety API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Sweety API:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function shutdown() {
  console.log('Shutting down Sweety API...');
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
