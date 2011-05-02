var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var object = {};
var fake = fake.create();

(function testInOrder() {
  fake.stub(object, 'a', null, true);

  fake.verify();

  assert.ok(object.a());
  assert.ok(object.a());

  fake.reset();
})();

(function testPriority() {
  fake.stub(object, 'b', null, 1);
  fake.expectAnytime(object, 'b', null, 2);
  fake.expect(object, 'b', null, 3);

  assert.equal(object.b(), 3);
  assert.equal(object.b(), 2);
  assert.equal(object.b(), 1);

  fake.reset();
})();

(function testStubVsAnytimeScoring() {
  fake.expectAnytime(object, 'c', null, 1);
  fake.stub(object, 'c', ['a'], 2);

  assert.equal(object.c('a'), 2);
  assert.equal(object.c(), 1);
})();
