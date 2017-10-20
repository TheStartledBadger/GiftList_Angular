const bodyParser = require('body-parser');
const http = require("http");
const expressApp = require('express');
const proxy = require('express-http-proxy');

// Get our API routes
const api = require('./routes/api'); 

// Create our server process
const app = expressApp();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set our api routes
app.use('/api', api);

app.all('*', proxy('localhost:4200'));
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
 
/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));