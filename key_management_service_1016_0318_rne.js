// 代码生成时间: 2025-10-16 03:18:23
const fastify = require('fastify')({ logger: true });

// 密钥管理服务
const keyManagementService = {
  // 存储密钥的集合
  keys: new Map(),

  // 生成一个UUID作为密钥ID
  generateKeyId: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  // 添加密钥
  addKey: (key) => {
    if (keyManagementService.keys.has(key.id)) {
      throw new Error('Key ID already exists.');
    }
    keyManagementService.keys.set(key.id, key.value);
  },

  // 获取密钥
  getKey: (keyId) => {
    if (!keyManagementService.keys.has(keyId)) {
      throw new Error('Key not found.');
    }
    return keyManagementService.keys.get(keyId);
  },

  // 删除密钥
  deleteKey: (keyId) => {
    if (!keyManagementService.keys.has(keyId)) {
      throw new Error('Key not found.');
    }
    keyManagementService.keys.delete(keyId);
  }
};

// 密钥创建路由
fastify.post('/keys', async (request, reply) => {
  const { key } = request.body;
  try {
    const newKeyId = keyManagementService.generateKeyId();
    keyManagementService.addKey({ id: newKeyId, value: key });
    reply.send({ keyId: newKeyId });
  } catch (error) {
    reply.status(400).send({ error: error.message });
  }
});

// 获取密钥路由
fastify.get('/keys/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    const key = keyManagementService.getKey(id);
    reply.send({ key });
  } catch (error) {
    reply.status(404).send({ error: error.message });
  }
});

// 删除密钥路由
fastify.delete('/keys/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    keyManagementService.deleteKey(id);
    reply.send({ message: 'Key deleted successfully.' });
  } catch (error) {
    reply.status(404).send({ error: error.message });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();