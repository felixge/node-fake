var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var scene = fake.scene();

(function testUnexpectedCall() {
  scene.fakeFunction(object, 'a');

  assert.throws(function() {
    object.a();
  }, /Unexpected call.+Object#a.+no calls/i);
})();
