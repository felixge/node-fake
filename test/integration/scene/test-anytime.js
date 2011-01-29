var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = fake.scene();

(function testInOrder() {
  scene.anytime(object, 'a');
  scene.anytime(object, 'b');

  object.a();
  object.b();
})();

(function testOutOfOrder() {
  scene.anytime(object, 'a');
  scene.anytime(object, 'b');

  object.b();
  object.a();
})();
