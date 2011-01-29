var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = new fake.Scene();

var callback = scene.callback();
(function testCallbackNotFired() {
  scene.expect(callback);

  var gotErr;
  try {
    scene.verify();
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);
})();

(function testCallbackFired() {
  callback();
  scene.verify();
})();
