var common = require('../common');
var assert = common.assert;
var fake = common.fake;

var sandbox = new fake.Sandbox();
var globals = {};
var locals = {localVariable: {}};

sandbox.setGlobals(globals);
sandbox.setLocals(locals);
sandbox.compile(common.dir.fixture+'/local.js');

// Test that local.js could access and modify our localVariable
assert.strictEqual(locals.localVariable.foo, 'bar');

// Make sure nothing leaked to the global scope
assert.deepEqual(Object.keys(globals), []);
