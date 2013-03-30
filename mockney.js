
var net = require('net');
var connect = net.Socket.prototype.connect;

var has = Object.prototype.hasOwnProperty;
var redirects = Object.create(null);

function mockConnect(options, cb) {
  // Support old API
  if (typeof options !== 'object') {
    return connect.apply(this, arguments);
  }
  
  // It is known that options is an object
  // Pipe is not supported by this module, so just call the original method
  if (options.pipe) {
     return connect.apply(this, arguments);
  }

  // host is not required and defaults to 127.0.0.1
  var hostname = (options.host ? options.host : '127.0.0.1') + ':' + options.port;

  // A redirect do exists, set host and port, note that port be be undefined
  if (has.call(redirects, hostname)) {
    options.host = redirects[hostname].host;
    options.port = redirects[hostname].port;
  }
  
  return connect.call(this, options, cb);
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
