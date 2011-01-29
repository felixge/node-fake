var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testTwoTimes() {
  var callback = scene.callback();

  scene
    .expect(callback)
    .times(2);

  // Scene should not verify without callback being called
  var gotErr = false;
  try {
    scene.verify();
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);

  // Scene should verify after two calls
  callback();
  callback();
  scene.verify();

  // Calling callback a third time should raise an error again
  gotErr = false;
  try {
    callback();
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);
})();

(function testZeroToTwoTimes() {
  var callback = scene.callback();

  scene
    .expect(callback)
    .times(0, 2);

  // Scene should not verify right away, since this callback is optional
  scene.verify();

  // Same should be true after the next two callbacks
  callback();
  callback();
  scene.verify();

  // The third callback should cause trouble
  var gotErr = false;
  try {
    callback();
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);
})();
