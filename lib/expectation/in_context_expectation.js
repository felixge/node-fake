var oop = require('../oop');
var util = require('util');
var Expectation = require('../expectation');

function InContextExpectation(properties) {
  this._context = null;

  Expectation.call(this, properties);
}
oop.inherits(InContextExpectation, Expectation);
module.exports = InContextExpectation;

InContextExpectation.create = function(trace, context) {
  return new InContextExpectation({
    _trace: trace,
    _context: context,
  });
};

InContextExpectation.prototype.diff = function(fakeCall, expectedCall) {
  var expected = this._context;
  var got = fakeCall.getContext();

  if (got === expected) {
    return;
  }

  return ['Unexpected value', util.inspect(expected), util.inspect(got)];
};
