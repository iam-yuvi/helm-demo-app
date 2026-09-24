const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = 'users-service';

// In-memory data store (keeps things simple — no DB dependency needed)
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
];

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: SERVICE_NAME });
});

app.get('/users', (req, res) => {
  res.status(200).json({ service: SERVICE_NAME, data: users });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id, 10));
  if (!user) {
    return res.status(404).json({ service: SERVICE_NAME, error: 'User not found' });
  }
  res.status(200).json({ service: SERVICE_NAME, data: user });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${PORT}`);
});
