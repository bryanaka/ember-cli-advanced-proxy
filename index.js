/* jshint node: true */
'use strict';
var AdvancedProxyAddon = require('./lib/ember-cli-advanced-proxy');

module.exports = {
  name: 'ember-cli-advanced-proxy',

  serverMiddleware: function(config) {
    var app = config.app;
    var options = config.options;
    var proxyAddon = new AdvancedProxyAddon(config.project);
    // TODO: THIS IS A HUGE HACK.
    // We shouldn't be removing middleware from the stack
    // and it we can match on anonymous functions, so no guarentees
    var middlewareStack = (app._router.stack || [])
    var middlewareToRemove = 10;
    if(middlewareStack.length > middlewareToRemove){
      middlewareStack.splice(middlewareToRemove, 1);
      app._router.stack = middlewareStack;
    }
    proxyAddon.serverMiddleware({
      app: app,
      options: options
    });
  }
};
