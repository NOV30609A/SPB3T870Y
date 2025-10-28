// 代码生成时间: 2025-10-28 15:29:03
const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg'); // PostgreSQL Client

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Health check route
fastify.get('/health', async (request, reply) => {
  reply.send({ status: 'ok' });
});

// Route to get data
fastify.get('/data', async (request, reply) => {
  try {
    // Execute query to get data
    const { rows } = await pool.query('SELECT * FROM your_table');
    reply.send(rows);
  } catch (error) {
    // Handle errors
    reply.status(500).send({ error: error.message });
  }
});

// Route to add data
fastify.post('/data', async (request, reply) => {
  const { key, value } = request.body;
  try {
    // Execute query to add data
    const { rows } = await pool.query(
      'INSERT INTO your_table (key, value) VALUES ($1, $2) RETURNING *',
      [key, value]
    );
    reply.send(rows[0]);
  } catch (error) {
    // Handle errors
    reply.status(500).send({ error: error.message });
  }
});

// Route to update data
fastify.put('/data/:id', async (request, reply) => {
  const { id } = request.params;
  const { key, value } = request.body;
  try {
    // Execute query to update data
    const { rows } = await pool.query(
      'UPDATE your_table SET key = $1, value = $2 WHERE id = $3 RETURNING *',
      [key, value, id]
    );
    reply.send(rows[0]);
  } catch (error) {
    // Handle errors
    reply.status(500).send({ error: error.message });
  }
});

// Route to delete data
fastify.delete('/data/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    // Execute query to delete data
    const { rows } = await pool.query('DELETE FROM your_table WHERE id = $1', [id]);
    reply.send({ message: 'Data deleted successfully', rows });
  } catch (error) {
    // Handle errors
    reply.status(500).send({ error: error.message });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server is running at ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();