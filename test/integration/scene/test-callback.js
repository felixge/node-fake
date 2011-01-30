var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

var callback = scene.callback();
(function testCallbackNotFired() {
  scene.expectNext(callback);

  assert.throws(function() {
    scene.verify();
  }, /unsatisifed/i);
})();

(function testCallbackFired() {
  callback();
  scene.verify();
})();
