var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testRightArgs() {
  var arg = {any: 'value'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs(arg);

  callback(arg);
})();

(function testWrongArgCount() {
  var arg = {any: 'value 1'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs();

  assert.throws(function() {
    callback(arg);
  }, /count/i);

  scene.reset();
})();

(function testWrongArg() {
  var arg = {any: 'value 1'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs(arg);

  assert.throws(function() {
    var otherArg = {any: 'value 2'};
    callback(otherArg);
  }, /different args/i);

  scene.reset();
})();
