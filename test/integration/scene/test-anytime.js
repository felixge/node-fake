var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = new fake.Scene();

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
