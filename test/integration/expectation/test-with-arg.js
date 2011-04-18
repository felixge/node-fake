var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testMatchArgOne() {
  var arg = {any: 'value'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArg(1, arg);

  callback(arg);
})();

(function testMismatchArgOne() {
  var arg = {any: 'value'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArg(1, arg);

  assert.throws(function() {
    callback();
  });
  scene.reset();
})();
