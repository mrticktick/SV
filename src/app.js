const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const orderItemRoutes = require('./routes/orderItem.routes');
const chalk = require('chalk');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8081',    // Add this for your current frontend
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

// Apply CORS middlewaredasasdasdasd
app.use(cors(corsOptions));

// Add logger middleware before routes
app.use(requestLogger);

app.use(express.json());
// app.use(morgan('dev'));
app.use(cookieParser());
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderItemRoutes);

// Error handling for CORS preflight
app.options('*', cors(corsOptions));

app.listen(3000, () => {
  // console.log('Server is running on port 3000');
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  );
  console.log('  Press CTRL-C to stop\n');
});

// ... rest of your app configuration 

module.exports = app; 