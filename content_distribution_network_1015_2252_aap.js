// 代码生成时间: 2025-10-15 22:52:45
const Fastify = require('fastify');
const fs = require('fs');
const path = require('path');

// 创建 Fastify 实例
const fastify = Fastify({
  logger: true
});

// 错误处理中间件
fastify.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({
    error: error.message || 'Internal server error'
  });
});

// 定义内容分发网络的路由
const CONTENT_PATH = path.join(__dirname, 'content'); // 内容存储路径

// 获取内容列表
fastify.get('/api/content', async (request, reply) => {
  try {
    const files = fs.readdirSync(CONTENT_PATH);
    return {
      files: files // 返回文件列表
    };
  } catch (error) {
    throw fastify.httpErrors.internalServerError('Failed to read content directory');
  }
});

// 获取特定内容
fastify.get('/api/content/:filename', async (request, reply) => {
  const { filename } = request.params;
  const filePath = path.join(CONTENT_PATH, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return {
      content: content // 返回文件内容
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw fastify.httpErrors.notFound('Content not found');
    } else {
      throw fastify.httpErrors.internalServerError('Failed to read content file');
    }
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// 导出 Fastify 实例，以便于测试
module.exports = fastify;
