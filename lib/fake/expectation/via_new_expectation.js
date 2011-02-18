var oop = require('../oop');
var Expectation = require('../expectation');

function ViaNewExpectation(properties) {
  Expectation.call(this, properties);
}
oop.inherits(ViaNewExpectation, Expectation);
module.exports = ViaNewExpectation;

ViaNewExpectation.create = function(trace) {
  return new ViaNewExpectation({
    _trace: trace,
  });
};

ViaNewExpectation.diff = function(expected, got) {
  if (!(got instanceof expected)) {
    return [
      'Constructor was called in wrong context',
      'this instanceof ' + expected.name,
      'this instanceof ' + got.constructor.name,
    ];
  }
};

ViaNewExpectation.prototype.getError = function(fakeCall) {
  var expected = fakeCall.getFakeFunction().getDelegator();
  var got = fakeCall.getContext();

  return this._getError(fakeCall, expected, got);
};
