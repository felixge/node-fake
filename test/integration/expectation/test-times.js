var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testTwoTimes() {
  var callback = scene.callback();

  scene
    .expectNext(callback)
    .times(2);

  // Scene should not verify without callback being called
  assert.throws(function() {
    scene.verify();
  }, /unsatisifed/i);

  // Scene should verify after two calls
  callback();
  callback();
  scene.verify();

  // Calling callback a third time should raise an error again
  assert.throws(function() {
    callback();
  }, /unexpected/);
})();

(function testZeroToTwoTimes() {
  var callback = scene.callback();

  scene
    .expectNext(callback)
    .times(0, 2);

  // Scene should not verify right away, since this callback is optional
  scene.verify();

  // Same should be true after the next two callbacks
  callback();
  callback();
  scene.verify();

  // The third callback should cause trouble
  assert.throws(function() {
    callback();
  }, /unexpected/i);
})();
