var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testCallbackNotFired() {
  var A = scene.object('A');
  var B = scene.object('B');

  scene.expect(A, 'foo');
  scene.expect(B, 'bar');

  assert.throws(function() {
    B.bar();
  }, /A#foo[\s\S]*B#bar/i);

  scene.reset();
})();
