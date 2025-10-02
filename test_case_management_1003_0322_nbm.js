// 代码生成时间: 2025-10-03 03:22:24
const fastify = require('fastify')({ logger: true });

// 假设我们有一个测试用例的数据结构
const testCases = [];

// 创建测试用例的接口
fastify.post('/create-test-case', async (request, reply) => {
  try {
    const { name, description } = request.body;
    if (!name) {
      reply.status(400).send({
        message: 'Test case name is required.'
      });
      return;
    }
    // 创建测试用例对象
    const newTestCase = {
      id: Date.now(), // 使用时间戳作为ID
      name,
      description,
      created_at: new Date().toISOString()
    };
    testCases.push(newTestCase);
    reply.status(201).send(newTestCase);
  } catch (error) {
    reply.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// 获取所有测试用例的接口
fastify.get('/get-test-cases', async (request, reply) => {
  try {
    reply.send(testCases);
  } catch (error) {
    reply.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// 获取单个测试用例的接口
fastify.get('/get-test-case/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const testCase = testCases.find(testCase => testCase.id === parseInt(id));
    if (!testCase) {
      reply.status(404).send({
        message: 'Test case not found.'
      });
      return;
    }
    reply.send(testCase);
  } catch (error) {
    reply.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// 更新测试用例的接口
fastify.put('/update-test-case/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, description } = request.body;
    let updated = false;
    const updatedTestCase = testCases.map(testCase => {
      if (testCase.id === parseInt(id)) {
        updated = true;
        return {
          ...testCase,
          name: name || testCase.name,
          description: description || testCase.description,
          updated_at: new Date().toISOString()
        };
      }
      return testCase;
    });
    if (!updated) {
      reply.status(404).send({
        message: 'Test case not found.'
      });
      return;
    }
    reply.send(updatedTestCase.find(testCase => testCase.id === parseInt(id)));
  } catch (error) {
    reply.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// 删除测试用例的接口
fastify.delete('/delete-test-case/:id', async (request, reply) => {
  try {
    const { id } = request.params;
    const index = testCases.findIndex(testCase => testCase.id === parseInt(id));
    if (index === -1) {
      reply.status(404).send({
        message: 'Test case not found.'
      });
      return;
    }
    testCases.splice(index, 1);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({
      message: 'Internal server error',
      error
    });
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();