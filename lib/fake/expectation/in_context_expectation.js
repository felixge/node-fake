var oop = require('../oop');
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

InContextExpectation.prototype.getError = function(fakeCall) {
  var expected = this._context;
  var got = fakeCall.getContext();

  return this._getError(fakeCall, expected, got);
};
