const express = require('express');
const app = express();
const productRoutes = require('./routes/product.routes');

app.use(express.json());
app.use('/api', productRoutes);

// ... rest of your app configuration 