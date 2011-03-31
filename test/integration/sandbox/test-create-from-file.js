var common = require('../../common');
var assert = common.assert;

var FIXTURE = common.dir.fixture + '/global.js';
var sandbox = require('fake/sandbox').createFromFile(FIXTURE);

// Test that we were able to export a globalVariable
assert.strictEqual(sandbox.context.globalVariable, true);
