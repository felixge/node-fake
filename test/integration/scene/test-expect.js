var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = fake.scene();

(function testInOrder() {
  scene.expectNext(object, 'a');
  scene.expectNext(object, 'b');

  object.a();
  object.b();
})();

(function testOutOfOrder() {
  scene.expectNext(object, 'a');
  scene.expectNext(object, 'b');

  assert.throws(function() {
    object.b();
  }, /different call/);

  scene.reset();
})();
