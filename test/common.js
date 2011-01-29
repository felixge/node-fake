var common = exports;
var path = require('path');
var fake = require('..');


common.assert = require('assert');
common.fake = fake;
common.dir = {
  fixture: path.join(__dirname, '/fixture'),
};

// Load a fixture in a minimal common-js style sandbox
common.requireFixture = function(fixture) {
  var sandbox = new fake.Sandbox();
  var exports = {};

  sandbox.setLocals({exports: exports});
  sandbox.compile(common.dir.fixture+'/'+fixture);

  return exports;
};
