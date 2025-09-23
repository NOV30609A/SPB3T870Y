// 代码生成时间: 2025-09-23 18:01:26
const Fastify = require('fastify');
const os = require('os');
const { spawn } = require('child_process');

// 创建 Fastify 实例
const fastify = Fastify({ logger: true });

// 定义启动进程的函数
function startProcess(command) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, [], {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(`Process ended with code ${code}`);
      } else {
        reject(`Process failed with code ${code}`);
      }
    });
  });
}

// 定义终止进程的函数
function stopProcess(pid) {
  return new Promise((resolve, reject) => {
    process.kill(pid, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`Process with PID ${pid} stopped successfully`);
      }
    });
  });
}

// 获取当前系统所有进程的路由
fastify.get('/processes', async (request, reply) => {
  try {
    const processes = os.cpus().map(cpu => cpu.times);
    reply.send({ processes });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to fetch processes' });
  }
});

// 启动新进程的路由
fastify.post('/start-process', async (request, reply) => {
  try {
    const { command } = request.body;
    const result = await startProcess(command);
    reply.status(201).send({ message: result });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to start process' });
  }
});

// 终止进程的路由
fastify.post('/stop-process', async (request, reply) => {
  try {
    const { pid } = request.body;
    const result = await stopProcess(pid);
    reply.send({ message: result });
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Failed to stop process' });
  }
});

// 启动 Fastify 服务器
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