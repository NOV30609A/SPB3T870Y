// 代码生成时间: 2025-10-30 20:58:15
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

// 定义版本控制系统的基本配置
const versionControlConfig = {
  repositoryPath: './repository'
};

// 创建仓库目录
if (!fs.existsSync(versionControlConfig.repositoryPath)) {
  fs.mkdirSync(versionControlConfig.repositoryPath);
}

// 获取仓库中的所有文件
async function listFiles() {
  try {
    const files = await fs.promises.readdir(versionControlConfig.repositoryPath);
    return files;
  } catch (error) {
    throw new Error('Failed to list files in the repository');
  }
}

// 添加文件到仓库
async function addFile(filePath, content) {
  try {
    const fullPath = path.join(versionControlConfig.repositoryPath, filePath);
    await writeFile(fullPath, content);
    return { success: true, message: 'File added successfully' };
  } catch (error) {
    throw new Error('Failed to add file to the repository');
  }
}

// 提交文件变更
async function commitFile(filePath, commitMessage) {
  try {
    const fullPath = path.join(versionControlConfig.repositoryPath, filePath);
    const stats = await fs.promises.stat(fullPath);
    if (stats.isFile()) {
      const commitPath = path.join(versionControlConfig.repositoryPath, 'commits', commitMessage);
      await fs.promises.copyFile(fullPath, commitPath);
      return { success: true, message: 'File committed successfully' };
    } else {
      throw new Error('File not found');
    }
  } catch (error) {
    throw new Error('Failed to commit file changes');
  }
}

// 快进合并
async function fastForwardMerge(commitId) {
  try {
    const commitPath = path.join(versionControlConfig.repositoryPath, 'commits', commitId);
    const files = await fs.promises.readdir(commitPath);
    for (const file of files) {
      const sourcePath = path.join(commitPath, file);
      const destinationPath = path.join(versionControlConfig.repositoryPath, file);
      await fs.promises.copyFile(sourcePath, destinationPath);
    }
    return { success: true, message: 'Fast-forward merge completed' };
  } catch (error) {
    throw new Error('Failed to perform fast-forward merge');
  }
}

// 注册Fastify路由
fastify.post('/add', async (request, reply) => {
  const { filePath, content } = request.body;
  try {
    const result = await addFile(filePath, content);
    reply.send(result);
  } catch (error) {
    reply.status(500).send({ success: false, message: error.message });
  }
});

fastify.post('/commit', async (request, reply) => {
  const { filePath, commitMessage } = request.body;
  try {
    const result = await commitFile(filePath, commitMessage);
    reply.send(result);
  } catch (error) {
    reply.status(500).send({ success: false, message: error.message });
  }
});

fastify.post('/merge/:commitId', async (request, reply) => {
  const commitId = request.params.commitId;
  try {
    const result = await fastForwardMerge(commitId);
    reply.send(result);
  } catch (error) {
    reply.status(500).send({ success: false, message: error.message });
  }
});

fastify.get('/files', async (request, reply) => {
  try {
    const files = await listFiles();
    reply.send({ files });
  } catch (error) {
    reply.status(500).send({ success: false, message: error.message });
  }
});

// 启动Fastify服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Version Control Service listening on port 3000`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();