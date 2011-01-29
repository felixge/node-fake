var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var scene = fake.scene();

(function testRightArgs() {
  var arg = {any: 'value'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs(arg);

  callback(arg);
})();

(function testWrongArgCount() {
  var arg = {any: 'value 1'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs();

  var gotErr;
  try {
    callback(arg);
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);
})();

(function testWrongArg() {
  var arg = {any: 'value 1'};
  var callback = scene.callback();

  scene
    .expect(callback)
    .withArgs(arg);

  var gotErr;
  try {
    var otherArg = {any: 'value 2'};
    callback(otherArg);
  } catch (e) {
    gotErr = e;
  }

  assert.ok(gotErr);
})();
