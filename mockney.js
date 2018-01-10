'use strict';

const net = require('net');
const normalizeArgs = net._normalizeArgs;
var connect = net.Socket.prototype.connect;

var has = Object.prototype.hasOwnProperty;
var redirects = Object.create(null);

function mockConnect(...args) {
  let normalized;
  // If passed an array, it's treated as an array of arguments that have
  // already been normalized.
  if (Array.isArray(args[0])) {
    normalized = args[0];
  } else {
    normalized = normalizeArgs(args);
  }
  var options = normalized[0];
  var cb = normalized[1];

  // host is not required and defaults to 127.0.0.1
  var hostname = (options.host ? options.host : '127.0.0.1') + ':' + options.port;

  // A redirect do exists, set host and port
  if (has.call(redirects, hostname)) {
    options.host = redirects[hostname].host;
    options.port = redirects[hostname].port;
  }

  return connect.apply(this, normalized);
}
net.Socket.prototype.connect = mockConnect;

//
// Manage internal redirects object
//
exports.redirect = function (from, to) {
  to = to.split(':');
  redirects[from] = { host: to[0], port: Number(to[1]) };
};

exports.restore = function (from) {
  delete redirects[from];
};
