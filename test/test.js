
var test = require('tap').test;
var endpoint = require('endpoint');

var mockney = require('../mockney.js');

var path = require('path');
var url = require('url');
var fs = require('fs');

var https = require('https');
var http = require('http');
var net = require('net');
var tls = require('tls');

var tlsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, './fixture/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, './fixture/cert.pem'))
};

var httpsServer = https.createServer(tlsOptions, function (req, res) {
  res.end('HTTPS redirected');
});

var httpServer = http.createServer(function (req, res) {
  res.end('HTTP redirected');
});

var tcpServer = net.createServer(function (socket) {
  socket.end('TCP redirected');
});

var tlsServer = tls.createServer(tlsOptions, function (socket) {
  socket.end('TLS redirected');
});

httpsServer.listen(0, 'localhost', function () {

  httpServer.listen(0, 'localhost', function () {

    tcpServer.listen(0, 'localhost', function () {

      tlsServer.listen(0, 'localhost', function () {
        mockney.redirect('remote.test:9000', 'localhost:' + httpsServer.address().port);
        mockney.redirect('remote.test:8000', 'localhost:' + httpServer.address().port);
        mockney.redirect('remote.test:7000', 'localhost:' + tcpServer.address().port);
        mockney.redirect('remote.test:6000', 'localhost:' + tlsServer.address().port);

        test('https is redirected', function (t) {
          var options = url.parse('https://remote.test:9000');
              options.rejectUnauthorized = false;

          https.get(options, function (res) {
            res.pipe(endpoint(function (err, buffer) {
              t.equal(err, null);
              t.equal(buffer.toString(), 'HTTPS redirected');
              t.end();
            }));
          });
        });
  
        test('http is redirected', function (t) {
          http.get('http://remote.test:8000', function (res) {
            res.pipe(endpoint(function (err, buffer) {
              t.equal(err, null);
              t.equal(buffer.toString(), 'HTTP redirected');
              t.end();
            }));
          });
        });
  
        test('tcp is redirected', function (t) {
          var socket = net.connect(7000, 'remote.test');
    
          socket.pipe(endpoint(function (err, buffer) {
            socket.end();
  
            t.equal(err, null);
            t.equal(buffer.toString(), 'TCP redirected');
            t.end();
          }));
        });
  
        test('tls is redirected', function (t) {
          var socket = tls.connect(6000, 'remote.test', {rejectUnauthorized: false});

          socket.pipe(endpoint(function (err, buffer) {
            socket.end();
  
            t.equal(err, null);
            t.equal(buffer.toString(), 'TLS redirected');
            t.end();
          }));
        });

        test('tcp is redirected', function (t) {
          mockney.restore('remote.test:7000');

          var socket = net.connect(7000, 'remote.test');

          socket.once('error', function (err) {
            t.equal(err.message, 'getaddrinfo ENOTFOUND');
            t.end();
          });
        });

        test('close server', function (t) {
          httpsServer.close(function () {
            httpServer.close(function () {
              tcpServer.close(function () {
                tlsServer.close(function () {
                  t.end();
                });
              });
            });
          });
        });
      });
    });
  });
});
