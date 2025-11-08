import { createApp } from './config/app';
import { connectDatabase, disconnectDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
  });

  const gracefulShutdown = (signal: string) => {
    server.close(async () => {
      console.log('HTTP server closed');

      await disconnectDatabase();

      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap();
