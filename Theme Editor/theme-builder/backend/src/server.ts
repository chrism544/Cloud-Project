import fastify from 'fastify';
import { registerErrorHandler } from './utils/errors';
import authPlugin from './plugins/auth';
import themeRoutes from './modules/theme/routes';

const server = fastify({ logger: true });

// Register plugins
server.register(authPlugin);

// Register routes
server.register(themeRoutes, { prefix: '/api/v1/theme' });

// Error handling
registerErrorHandler(server);

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 3001 });
    server.log.info(`Server listening on http://localhost:3001`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();