var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testRightArgCountWins() {
  var callback = scene.callback();

  scene
    .expectAnytime(callback);

  var arg = {any: 'object'};
  scene
    .expectAnytime(callback)
    .withArgs(arg);

  // Should be matched by the second expectation, since it has a higher score
  callback(arg);

  // Should be matched by the first expectation, since it has a lower score
  callback();
})();
