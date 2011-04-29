var oop = require('../oop');
var util = require('util');
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

WithArgExpectation.diff = function(expected, got) {
  if (got === expected) {
    return;
  }

  return ['Unexpected value', util.inspect(expected), util.inspect(got)];
};


WithArgExpectation.prototype.getError = function(expectedCall, fakeCall) {
  var expected = this._value;
  var got = fakeCall.getArg(this._number - 1);

  return this._getError(fakeCall, expected, got);
};
