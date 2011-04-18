var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testCallbackNotFired() {
  var cb = scene.expect();

  assert.throws(function() {
    scene.verify();
  }, /callee/i);

  cb();
})();
