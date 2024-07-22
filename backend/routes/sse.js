const clients = new Map();

const setupSSE = (app) => {
  app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const id = Date.now();
    clients.set(id, res);

    req.on('close', () => {
      clients.delete(id);
    });
  });
};

const sendToClients = (message) => {
  clients.forEach((client, id) => {
    try {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    } catch (error) {
      console.error(`Error sending message to client ${id}:`, error);
      clients.delete(id);
    }
  });
};

module.exports = { setupSSE, sendToClients };
