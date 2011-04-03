var oop = require('../oop');
var util = require('util');
var Expectation = require('../expectation');

function WithArgsExpectation(properties) {
  this._args = null;

  Expectation.call(this, properties);
}
oop.inherits(WithArgsExpectation, Expectation);
module.exports = WithArgsExpectation;

WithArgsExpectation.create = function(trace) {
  var args = Array.prototype.slice.call(arguments, 1);

  return new WithArgsExpectation({
    _trace: trace,
    _args: args,
  });
};

WithArgsExpectation.diff = function(expected, got) {
  if (expected.length !== got.length) {
    return [
      'Unexpected argument count',
      expected.length + ' argument' + (expected.length === 1 ? '' : 's'),
      got.length + ' argument' + (got.length === 1 ? '' : 's'),
    ];
  }

  for (var i = 0; i < expected.length; i++) {
    if (expected[i] !== got[i]) {
      return [
        'Unexpected argument #' + (i + 1),
        util.inspect(expected[i]),
        util.inspect(got[i]),
      ];
    }
  }
};

WithArgsExpectation.prototype.getError = function(fakeCall) {
  var expected = this._args;
  var got = fakeCall.getArgs();

  return this._getError(fakeCall, expected, got);
};
