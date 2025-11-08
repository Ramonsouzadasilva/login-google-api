// import 'dotenv/config';
// import { createApp } from './config/app';
// import { connectDatabase, disconnectDatabase } from './config/database';

import { createApp } from './config/app';
import { connectDatabase, disconnectDatabase } from './config/database';

// const PORT = process.env.PORT || 3000;

// async function bootstrap() {
//   try {
//     // Connect to database
//     await connectDatabase();

//     // Create Express app
//     const app = createApp();

//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
//       console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
//     });

//     // Graceful shutdown
//     const gracefulShutdown = (signal: string) => {
//       console.log(`\n🔄 ${signal} received. Starting graceful shutdown...`);

//       server.close(async () => {
//         console.log('✅ HTTP server closed');

//         await disconnectDatabase();
//         console.log('✅ Database disconnected');

//         console.log('✅ Graceful shutdown completed');
//         process.exit(0);
//       });
//     };

//     process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//     process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// }

// bootstrap();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n🔄 ${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log('✅ HTTP server closed');

      await disconnectDatabase();
      console.log('✅ Database disconnected');

      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap();
