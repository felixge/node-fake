var Scene = require('./scene');
var Sandbox = require('./sandbox');

exports.scene = function() {
  return new Scene();
};

exports.sandbox = function() {
  return new Sandbox();
};
