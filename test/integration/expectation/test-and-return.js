var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testHandle() {
  var val = {any: 'object 1'};

  var callback = scene.callback();

  scene
    .expect(callback)
    .andReturn(val);

  var r = callback();
  assert.strictEqual(r, val);
})();
