var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testOutOfContext() {
  var context = {};
  var callback = scene.callback();

  scene
    .expectNext(callback)
    .inContext(context);

  assert.throws(function() {
    callback();
  }, /context/i);

  scene.reset();
})();

(function testInContext() {
  var context = {};
  var callback = scene.callback();

  scene
    .expectNext(callback)
    .inContext(context);

  callback.call(context);
})();
