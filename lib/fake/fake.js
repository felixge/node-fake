var Scene = require('./scene');
var Sandbox = require('./sandbox');
var StackTrace = require('./stack_trace');

var autoVerify = [];

exports.scene = function() {
  var scene = new Scene();
  autoVerify.push(scene);
  return scene;
};

exports.sandbox = function() {
  return new Sandbox();
};

exports.stackTrace = function(belowFn) {
  return StackTrace.get(belowFn || exports.stackTrace);
};

process.on('exit', function() {
  autoVerify.forEach(function(scene) {
    scene.verify();
  });
});
