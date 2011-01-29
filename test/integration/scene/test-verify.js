var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = new fake.Scene();

(function testNewSceneVerifies() {
  scene.verify();
})();

(function testExpectationNotFullfilled() {
  scene.anytime(object, 'someMethod');

  var exception;
  try {
    scene.verify();
  } catch (e) {
    exception = e;
  }

  assert.ok(exception);
})();

(function testExpectationFullfilled() {
  object.someMethod();
  scene.verify();
})();
