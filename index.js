/* jshint node: true */
'use strict';
var AdvancedProxyAddon = require('./lib/ember-cli-advanced-proxy');
/*
* This number represents the position that the proxy middleware holds in
* Ember CLI's normal express middleware stack.
*/
var MIDDLEWARE_TO_REMOVE = 12;

module.exports = {
  name: 'ember-cli-advanced-proxy',

  serverMiddleware: function(config) {
    var app = config.app;
    var options = config.options;
    var proxyAddon = new AdvancedProxyAddon(config.project);
    // HACK: THIS IS A HUGE HACK.
    // We shouldn't be removing middleware from the stack
    // and it we can match on anonymous functions, so no guarentees
    var middlewareStack = (app._router.stack || [])

    if(middlewareStack.length > MIDDLEWARE_TO_REMOVE){
      middlewareStack.splice(MIDDLEWARE_TO_REMOVE, 1);
      app._router.stack = middlewareStack;
    }
    proxyAddon.serverMiddleware({
      app: app,
      options: options
    });
  }
};
