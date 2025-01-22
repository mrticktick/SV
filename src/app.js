const express = require('express');
const app = express();
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// ... rest of your app configuration 