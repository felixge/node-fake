var oop = require('../oop');
var Expectation = require('../expectation');

function WithArgExpectation(properties) {
  this._number = null;
  this._value = null;

  Expectation.call(this, properties);
}
oop.inherits(WithArgExpectation, Expectation);
module.exports = WithArgExpectation;

WithArgExpectation.prototype.canBeUsedMultipleTimes = function() {
  return true;
};

WithArgExpectation.create = function(trace, number, value) {
  return new WithArgExpectation({
    _trace: trace,
    _number: number,
    _value: value,
  });
};

WithArgExpectation.prototype.getError = function(fakeCall) {
  var expected = this._value;
  var got = fakeCall.getArg(this._number - 1);

  return this._getError(fakeCall, expected, got);
};
