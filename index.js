/* jshint node: true */
'use strict';
var AdvancedProxyAddon = require('./lib/ember-cli-advanced-proxy');

module.exports = {
  name: 'ember-cli-advanced-proxy',

  serverMiddleware: function(config) {
    var app = config.app;
    var options = config.options;
    var proxyAddon = new AdvancedProxyAddon(config);
    app.stack.forEach(function(middleware) {
      console.log('\n\n\n');
      console.log(middleware);
      console.log('\n\n\n');
    });
    // proxyAddon.serverMiddleware({
    //   app: app,
    //   options: options
    // });
  }
};
