var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = fake.scene();

(function testNewSceneVerifies() {
  scene.verify();
})();

(function testExpectationNotFullfilled() {
  scene.expectAnytime(object, 'someMethod');

  assert.throws(function() {
    scene.verify();
  }, /expected a different call/i);
})();

(function testExpectationFullfilled() {
  object.someMethod();
  scene.verify();
})();
