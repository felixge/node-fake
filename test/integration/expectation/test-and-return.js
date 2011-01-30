var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testAndReturn() {
  var val = {any: 'object 1'};

  var callback = scene.callback();

  scene
    .expectNext(callback)
    .andReturn(val);

  var r = callback();
  assert.strictEqual(r, val);
})();
