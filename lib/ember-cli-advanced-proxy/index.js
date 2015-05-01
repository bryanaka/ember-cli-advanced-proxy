'use strict';
var HttpProxy = require('http-proxy');

function extractSubdomain(host) {
  var subdomain = '';
  var domainPieces = host.split('.');

  if(domainPieces.length > 2) {
    subdomain = domainPieces[0];
    if(subdomain === 'www') { subdomain = ''}
  }

  return subdomain;
}

function injectSubdomain(proxyHost, subdomain) {
  if(proxyHost.indexOf('*') < 0) { return; }
  if(subdomain) {
    // needs trailing dot only if the subdomain is used
    subdomain += '.';
  }
  return proxyHost.replace(/\*\./, subdomain);
}

function ProxyServerAddon(project) {
  this.project = project;
  this.name = 'advanced-proxy-server-middleware';
}

ProxyServerAddon.prototype.serverMiddleware = function(options) {
  var app = options.app, server = options.options.httpServer;
  options = options.options;

  if (options.proxy) {
    var proxy = HttpProxy.createProxyServer({
      target: options.proxy,
      ws: true,
      secure: !options.insecureProxy,
      changeOrigin: true,
      autoRewrite: true  // changes the redircts to have a matching host
    });

    proxy.on('error', function (e) {
      options.ui.writeLine('Error proxying to ' + options.proxy);
      options.ui.writeError(e);
    });

    // original proxy already prints this before removing it
    // from the middleware stack
    // options.ui.writeLine('Proxying to ' + options.proxy);

    server.on('upgrade', function (req, socket, head) {
      options.ui.writeLine('Proxying websocket to ' + req.url);
      proxy.ws(req, socket, head);
    });

    app.use(function(req, res) {
      var subdomain = extractSubdomain(req.headers.host);
      var targetURL = injectSubdomain(options.proxy, subdomain);
      return proxy.web(req, res, { target: targetURL });
    });
  }
};

module.exports = ProxyServerAddon;
