const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = 'products-service';

// In-memory data store (keeps things simple — no DB dependency needed)
const products = [
  { id: 1, name: 'Wireless Mouse', price: 19.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99 },
  { id: 3, name: '4K Monitor', price: 249.99 },
];

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: SERVICE_NAME });
});

app.get('/products', (req, res) => {
  res.status(200).json({ service: SERVICE_NAME, data: products });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id, 10));
  if (!product) {
    return res.status(404).json({ service: SERVICE_NAME, error: 'Product not found' });
  }
  res.status(200).json({ service: SERVICE_NAME, data: product });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} listening on port ${PORT}`);
});
