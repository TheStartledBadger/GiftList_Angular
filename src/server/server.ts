const bodyParser = require('body-parser');
const http = require("http");
import * as express from 'express';
const expressSession = require('express-session');
const proxy = require('express-http-proxy');
import { PassportSetup } from './setupPassport';

// Get our API routes
const apiInfo = require('./routes/api'); 
const api = apiInfo().router;
const data = apiInfo().data;

// Create our server process
const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var ppSetup = new PassportSetup();
var isLoggedIn = ppSetup.setupPassport(app, data);


// Set our api routes
app.use('/api', isLoggedIn, api);
app.all('*', isLoggedIn, proxy('localhost:4200'));
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