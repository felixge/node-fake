var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = fake.scene();

(function testInOrder() {
  scene.expectAnytime(object, 'a');
  scene.expectAnytime(object, 'b');

  object.a();
  object.b();
})();

(function testOutOfOrder() {
  scene.expectAnytime(object, 'a');
  scene.expectAnytime(object, 'b');

  object.b();
  object.a();
})();
