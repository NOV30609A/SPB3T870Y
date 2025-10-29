// 代码生成时间: 2025-10-30 04:11:41
const fastify = require('fastify')({ logger: true });

// Define the virtualization manager routes
const virtualRoutes = (fastify, opts, done) => {
  // GET endpoint to get all virtual machines
  fastify.get('/virtual-machines', async (request, reply) => {
    try {
      // Fetch all virtual machines from storage (e.g., database)
      // For demonstration, we'll use a static array
      const virtualMachines = [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ];
      return virtualMachines;
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // GET endpoint to get a specific virtual machine by id
  fastify.get('/virtual-machines/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      // Fetch virtual machine by id from storage
      // For demonstration, we'll filter from the static array
      const vm = [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ].find(vm => vm.id.toString() === id);
      if (!vm) {
        return reply.status(404).send({ error: 'Virtual Machine Not Found' });
      }
      return vm;
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // POST endpoint to create a new virtual machine
  fastify.post('/virtual-machines', async (request, reply) => {
    try {
      // Validate the request body for required fields
      const { name, status } = request.body;
      if (!name || !status) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }
      // Create a new virtual machine in storage
      // For demonstration, we'll simulate by pushing to the array
      const newVM = {
        id: Date.now(), // Simple id generation for demonstration
        name,
        status
      };
      [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ].push(newVM); // NOTE: This won't persist across server restarts
      return { message: 'Virtual Machine Created', vm: newVM };
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // PUT endpoint to update a specific virtual machine by id
  fastify.put('/virtual-machines/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, status } = request.body;
      const index = [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ].findIndex(vm => vm.id.toString() === id);
      if (index === -1) {
        return reply.status(404).send({ error: 'Virtual Machine Not Found' });
      }
      // Update the virtual machine in storage
      const updatedVM = { ...[
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ][index], name, status };
      [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ][index] = updatedVM; // NOTE: This won't persist across server restarts
      return { message: 'Virtual Machine Updated', vm: updatedVM };
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  // DELETE endpoint to delete a specific virtual machine by id
  fastify.delete('/virtual-machines/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const index = [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ].findIndex(vm => vm.id.toString() === id);
      if (index === -1) {
        return reply.status(404).send({ error: 'Virtual Machine Not Found' });
      }
      // Delete the virtual machine from storage
      [
        { id: 1, name: 'VM1', status: 'active' },
        { id: 2, name: 'VM2', status: 'inactive' }
      ].splice(index, 1); // NOTE: This won't persist across server restarts
      return { message: 'Virtual Machine Deleted' };
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  done();
};

// Register the virtualization manager plugin
fastify.register(virtualRoutes);

// Start the server
const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer().catch(err => {
  fastify.log.error(err);
  process.exit(1);
});