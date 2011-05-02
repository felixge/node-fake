var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testInOrder() {
  fake.expectAnytime(object, 'a');
  fake.expectAnytime(object, 'b');

  object.a();
  object.b();
})();

(function testOutOfOrder() {
  fake.expectAnytime(object, 'a');
  fake.expectAnytime(object, 'b');

  object.b();
  object.a();
})();
