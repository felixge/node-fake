var common = require('../../common');
var assert = common.assert;
var fake = common.fake;


(function testFakeStackTrace() {
  var trace = fake.stackTrace();
  var firstFn = trace.first().getFunctionName();

  assert.strictEqual(firstFn, 'testFakeStackTrace');
})();
