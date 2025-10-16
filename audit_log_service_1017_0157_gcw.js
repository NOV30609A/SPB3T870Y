// 代码生成时间: 2025-10-17 01:57:24
const fastify = require('fastify')({ logger: true });

// Middleware to log requests
const requestLogger = async (request, reply) => {
  const start = Date.now();
  await reply.send();
  const ms = Date.now() - start;
  fastify.log.info({
    method: request.method,
    url: request.url,
    responseTime: `${ms} ms`,
    statusCode: reply.raw.statusCode
  });
};

// Middleware to log errors
const errorLogger = (error, request, reply) => {
  fastify.log.error({
    error: error.message,
    method: request.method,
    url: request.url
  });
  reply.send();
};

// Setup routes
fastify.get('/', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
    },
    tags: ['api']
  }
}, async (request, reply) => {
  try {
    // Simulate a successful operation
    return { message: 'Audit log service is running' };
  } catch (error) {
    // Handle unexpected errors
    reply.code(500);
    return { error: error.message };
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info('Server is running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Register middlewares
fastify.use(requestLogger);
fastify.addHook('onError', errorLogger);

// Document the API using Swagger
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Audit Log API',
      description: 'API for audit log service',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});