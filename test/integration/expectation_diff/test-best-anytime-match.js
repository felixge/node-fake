var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testRightArgCountWins() {
  var callback = scene.callback();
  var expectedContext = {any: 'expected context'};
  var unexpectedContext = {any: 'unexpected context'};

  scene.expectAnytime(callback);

  var arg = {any: 'object 1'};
  scene
    .expectAnytime(callback)
    .withArgs(arg);

  scene.expectAnytime(callback);

  scene
    .expectAnytime(callback)
    .inContext(expectedContext);

  callback.call(unexpectedContext, arg);

  callback.call(expectedContext);

  callback.call(unexpectedContext);

  callback.call(unexpectedContext);
})();
