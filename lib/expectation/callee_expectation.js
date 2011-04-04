var oop = require('../oop');
var Expectation = require('../expectation');

function CalleeExpectation(properties) {
  this._fakeFunction = null;

  Expectation.call(this, properties);
}
oop.inherits(CalleeExpectation, Expectation);
module.exports = CalleeExpectation;

CalleeExpectation.create = function(trace, fakeFunction) {
  return new CalleeExpectation({
    _trace: trace,
    _fakeFunction: fakeFunction,
  });
};

CalleeExpectation.diff = function(expected, got) {
  if (expected !== got.getFakeFunction()) {
    return [
      'Expected a different call',
      expected.getName(),
      got.getSignature()
    ];
  }
};

CalleeExpectation.prototype.getError = function(fakeCall) {
  var expected = this._fakeFunction;
  var got = fakeCall;

  return this._getError(fakeCall, expected, got);
};

// This expectation is fulfilled by default, so it doesn't keep a
// times(0, n) expectation from being recognized as fulfilled.
CalleeExpectation.prototype.isFulfilled = function() {
  return true;
};
