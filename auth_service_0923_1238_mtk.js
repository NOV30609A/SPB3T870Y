// 代码生成时间: 2025-09-23 12:38:52
const fastify = require('fastify')({ logger: true });

// 模拟用户数据库
const users = {
  'user1': { username: 'user1', password: 'password1' }
};

// 用户登录
fastify.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  
  // 检查用户名和密码是否匹配
  if (users[username] && users[username].password === password) {
    return {
      success: true,
      message: 'Login successful',
      token: 'some-generated-token'
    };
  } else {
    reply.status(401); // Unauthorized
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
});

// 用户注册
fastify.post('/register', async (request, reply) => {
  const { username, password } = request.body;
  
  // 检查用户名是否已存在
  if (users[username]) {
    reply.status(409); // Conflict
    return {
      success: false,
      message: 'Username already exists'
    };
  } else {
    // 保存新用户
    users[username] = { username, password };
    return {
      success: true,
      message: 'Registration successful'
    };
  }
});

// 启动服务器
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();