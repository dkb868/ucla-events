#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('ucla-events:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = app.listen(port, function() {
    console.log('App listening on port ' + port);
});

module.exports = server;
