// 代码生成时间: 2025-10-07 03:57:24
const fastify = require('fastify')({ logger: true });

// 模拟供应商数据
const suppliers = [
  { id: 1, name: '供应商A', contact: '联系人A', email: 'supplierA@example.com' },
  { id: 2, name: '供应商B', contact: '联系人B', email: 'supplierB@example.com' },
  // ...其他供应商数据
];

// 添加供应商
fastify.post('/api/suppliers', async (request, reply) => {
  const { name, contact, email } = request.body;
  if (!name || !contact || !email) {
    return reply.status(400).send({
      message: '供应商信息不完整'
    });
  }
  const newSupplier = { id: Date.now(), name, contact, email };
  suppliers.push(newSupplier);
  return reply.status(201).send(newSupplier);
});

// 获取供应商列表
fastify.get('/api/suppliers', async (request, reply) => {
  return reply.status(200).send(suppliers);
});

// 获取单个供应商信息
fastify.get('/api/suppliers/:id', async (request, reply) => {
  const { id } = request.params;
  const supplier = suppliers.find(s => s.id === parseInt(id));
  if (!supplier) {
    return reply.status(404).send({
      message: '供应商不存在'
    });
  }
  return reply.status(200).send(supplier);
});

// 更新供应商信息
fastify.put('/api/suppliers/:id', async (request, reply) => {
  const { id } = request.params;
  const { name, contact, email } = request.body;
  const supplier = suppliers.find(s => s.id === parseInt(id));
  if (!supplier) {
    return reply.status(404).send({
      message: '供应商不存在'
    });
  }
  supplier.name = name ? name : supplier.name;
  supplier.contact = contact ? contact : supplier.contact;
  supplier.email = email ? email : supplier.email;
  return reply.status(200).send(supplier);
});

// 删除供应商
fastify.delete('/api/suppliers/:id', async (request, reply) => {
  const { id } = request.params;
  const supplierIndex = suppliers.findIndex(s => s.id === parseInt(id));
  if (supplierIndex === -1) {
    return reply.status(404).send({
      message: '供应商不存在'
    });
  }
  suppliers.splice(supplierIndex, 1);
  return reply.status(200).send({
    message: '供应商删除成功'
  });
});

// 启动服务
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`服务器启动成功，地址：http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
