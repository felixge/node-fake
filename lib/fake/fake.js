var Scene = require('./scene');
var Sandbox = require('./sandbox');

var autoVerify = [];

exports.scene = function() {
  var scene = new Scene();
  autoVerify.push(scene);
  return scene;
};

exports.sandbox = function() {
  return new Sandbox();
};

process.on('exit', function() {
  autoVerify.forEach(function(scene) {
    scene.verify();
  });
});
