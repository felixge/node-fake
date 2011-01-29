var common = require('../common');
var assert = common.assert;
var fake = common.fake;

(function testCallbackThatNeverGetsCalled() {
  var scene = fake.scene();
  var callback = scene.callback();
  scene.expect(callback);
})();
