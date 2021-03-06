var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testUnexpectedCall() {
  fake.fakeFunction(object, 'a');

  assert.throws(function() {
    object.a();
  }, /Unexpected call.+"Object#a\(\)".+no calls/i);
})();
