// 代码生成时间: 2025-11-03 10:40:17
const fastify = require('fastify')({ logger: true });

// 模拟转化率数据
const conversionData = {
  'pageA': {
    totalVisits: 1000,
    totalConversions: 150
  },
  'pageB': {
    totalVisits: 800,
    totalConversions: 120
  },
  'pageC': {
    totalVisits: 1200,
    totalConversions: 180
  }
};

// 计算转化率的函数
function calculateConversionRate(visits, conversions) {
  if (visits === 0) {
    throw new Error('Total visits cannot be zero');
  }
  return (conversions / visits) * 100;
}

// 创建一个路由来计算转化率
fastify.get('/calculate-conversion-rate/:pageId', async (request, reply) => {
  const { pageId } = request.params;
  try {
    const pageData = conversionData[pageId];
    if (!pageData) {
      reply.code(404).send({ error: 'Page not found' });
      return;
    }

    const { totalVisits, totalConversions } = pageData;
    const conversionRate = calculateConversionRate(totalVisits, totalConversions);

    reply.send({
      pageId,
      conversionRate: conversionRate.toFixed(2) + '%'
    });
  } catch (error) {
    reply.code(500).send({ error: error.message });
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