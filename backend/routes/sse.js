const clients = new Map();

const setupSSE = (app) => {
  app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const userId = req.query.userId
  if (!userId){
    res.status(400).send('User Id is required');
    return;
  }
    clients.set(userId, res);

    req.on('close', () => {
      clients.delete(userId);
    });
  });
};

const sendToClients = (message, userId) => {
  const client = clients.get(userId);
  if (client) {try {
    client.write(`event: notification\ndata: ${JSON.stringify(message)}\n\n`);
  } catch (error) {
    console.error(`Error sending message to client ${userId}:`, error);
    clients.delete(userId);
  }
}
  }

const sendToClient = (message, excludeUserId = null) => {
  clients.forEach((client, userId) => {
    if ( userId === excludeUserId) return;
    try {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    } catch (error) {
      console.error(`Error sending message to client ${userId}:`, error);
      clients.delete(userId);
    }
  });
};

module.exports = { setupSSE, sendToClients, sendToClient };
