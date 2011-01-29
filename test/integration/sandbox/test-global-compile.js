var common = require('../../common');
var assert = common.assert;
var fake = common.fake;

var sandbox = new fake.Sandbox();
var globals = {};

sandbox.setGlobals(globals);
sandbox.compile(common.dir.fixture+'/global.js');

// Test that we were able to export a globalVariable
assert.strictEqual(globals.globalVariable, true);
