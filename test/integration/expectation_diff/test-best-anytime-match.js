var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testRightArgCountWins() {
  var callback = scene.callback();

  scene.expectAnytime(callback);

  var arg = {any: 'object 1'};
  scene
    .expectAnytime(callback)
    .withArgs(arg);

  scene.expectAnytime(callback);

  var context = {any: 'object 2'};
  scene
    .expectAnytime(callback)
    .inContext(context);

  callback(arg);

  callback.call(context);

  callback();

  callback();
})();
