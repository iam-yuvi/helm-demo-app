const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_NAME = 'gateway-service';

// These URLs are the important bit for your Helm/K8s learning:
// In K8s, these will become the Service DNS names (e.g. http://users-service:3001)
// In Helm, these become configurable values in values.yaml -> injected via ConfigMap/env.
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3001';
const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002';

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: SERVICE_NAME });
});

// Aggregates data from both downstream services
app.get('/', async (req, res) => {
  try {
    const [usersRes, productsRes] = await Promise.all([
      axios.get(`${USERS_SERVICE_URL}/users`, { timeout: 5000 }),
      axios.get(`${PRODUCTS_SERVICE_URL}/products`, { timeout: 5000 }),
    ]);

    res.status(200).json({
      service: SERVICE_NAME,
      message: 'Aggregated response from downstream services',
      users: usersRes.data.data,
      products: productsRes.data.data,
    });
  } catch (err) {
    res.status(502).json({
      service: SERVICE_NAME,
      error: 'Failed to reach one or more downstream services',
      details: err.message,
    });
  }
});

// Proxy-style pass-through routes, useful for testing each dependency individually
app.get('/users', async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/users`, { timeout: 5000 });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(502).json({ service: SERVICE_NAME, error: 'users-service unreachable', details: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCTS_SERVICE_URL}/products`, { timeout: 5000 });
    res.status(200).json(response.data);
  } catch (err) {
    res.status(502).json({ service: SERVICE_NAME, error: 'products-service unreachable', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${PORT}`);
  console.log(`-> USERS_SERVICE_URL=${USERS_SERVICE_URL}`);
  console.log(`-> PRODUCTS_SERVICE_URL=${PRODUCTS_SERVICE_URL}`);
});
