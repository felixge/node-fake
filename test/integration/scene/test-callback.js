var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

var callback = scene.callback();
(function testCallbackNotFired() {
  scene.expectNext(callback);

  assert.throws(function() {
    scene.verify();
  }, /callee/i);
})();

(function testCallbackFired() {
  callback();
  scene.verify();
})();

(function testNamedVsUnnamedCallback() {
  var named = scene.callback('my_callback');
  var unnamed = scene.callback();

  scene.expectNext(unnamed);

  assert.throws(function() {
    named();
  }, /anonymous[\s\S]*my_callback/);

  scene.reset();
})();
