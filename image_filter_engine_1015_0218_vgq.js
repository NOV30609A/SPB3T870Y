// 代码生成时间: 2025-10-15 02:18:24
const fastify = require('fastify')({ logger: true });
const sharp = require('sharp');
const fs = require('fs/promises');

// 定义支持的滤镜类型
const supportedFilters = ['grayscale', 'sepia', 'contrast', 'brightness'];

// 错误处理中间件
fastify.setErrorHandler((error, request, reply) => {
  reply.send({ error: error.message });
});

// 上传图像文件
fastify.post('/upload', async (request, reply) => {
  try {
    const file = request.file;
    const { buffer } = await file.toBuffer();
    // 保存到临时目录
    const tempPath = `temp/${Date.now()}-${file.filename}`;
    await fs.writeFile(tempPath, buffer);
    return {
      message: 'File uploaded successfully',
      path: tempPath
    };
  } catch (error) {
    throw new Error('Failed to upload file');
  }
});

// 应用滤镜
fastify.post('/:filter', async (request, reply) => {
  try {
    const { filter } = request.params;
    if (!supportedFilters.includes(filter)) {
      throw new Error('Unsupported filter type');
    }

    const { path } = request.body;
    const outputPath = `output/${filter}/${Date.now()}-${path.split('/').pop()}`;

    // 应用滤镜
    const processedImage = sharp(path)
      ."${filter}"()
      .toFile(outputPath);

    await processedImage;
    return {
      message: 'Filter applied successfully',
      outputPath
    };
  } catch (error) {
    throw new Error(error.message);
  }
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();