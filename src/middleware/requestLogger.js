const morgan = require('morgan');
const colors = require('colors');

// Create custom token for response time in ms
morgan.token('response-time-ms', function (req, res) {
  return res.responseTime ? res.responseTime + ' ms' : '0 ms';
});

// Create custom token for colored status
morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  let color;

  if (status >= 500) color = 'red';
  else if (status >= 400) color = 'yellow';
  else if (status >= 300) color = 'cyan';
  else color = 'green';

  return colors[color](status);
});

// Create custom format with colored status
const loggerFormat = ':method :url :status-colored :response-time-ms - :res[content-length]';

const requestLogger = morgan(loggerFormat, {
  // Optional: add custom logging logic
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
});

module.exports = requestLogger; 