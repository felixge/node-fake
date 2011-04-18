var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testOutOfContext() {
  var expectedContext = {any: 'expected context'};
  var unexpectedContext = {any: 'unexpected context'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .inContext(expectedContext);

  assert.throws(function() {
    callback.call(unexpectedContext);
  }, /context/i);

  scene.reset();
})();

(function testInContext() {
  var context = {};
  var callback = scene.callback();

  scene
    .expect(callback)
    .inContext(context);

  callback.call(context);
})();
