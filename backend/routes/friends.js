// Function to send a notification to a specific user
const sendToClient = (message, userId) => {
  const client = clients.get(userId);
  if (client) {
    try {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    } catch (error) {
      console.error(`Error sending message to client ${userId}:`, error);
      clients.delete(userId); // Remove client on error
    }
  } else {
    console.warn(`No active SSE connection found for user ${userId}`);
  }
};
