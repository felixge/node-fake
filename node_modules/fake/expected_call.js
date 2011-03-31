var StackTrace = require('./stack_trace');
var Expectation = require('./expectation');
var Collection = require('./collection');

function ExpectedCall(properties) {
  this._expectations = new Collection();

  this._return = undefined;
  this._handler = null;

  this._lastArgs = [];
  this._calls = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = ExpectedCall;

ExpectedCall.create = function() {
  return new ExpectedCall();
}

var expectations = Expectation.requireAll();
expectations.forEach(function(Expectation) {
  var type = Expectation.getType()

  ExpectedCall.prototype[type] = function() {
    var args = Array.prototype.slice.call(arguments);

    var trace = (args[0] instanceof StackTrace)
      ? args.shift()
      : StackTrace.get(arguments.callee);

    args = [trace].concat(args);

    var expectation = Expectation.create.apply(null, args);

    if (!expectation.canBeUsedMultipleTimes()) {
      var previousExpectation = this._expectations
        .where('getType', expectation.getType())
        .first();

      this._expectations.remove(previousExpectation);
    }

    this._expectations.add(expectation);

    return this;
  };
});

ExpectedCall.prototype.andHandle = function(handler) {
  this._handler = handler;
};

ExpectedCall.prototype.andReturn = function(val) {
  this._return = val;
  return this;
};

ExpectedCall.prototype.getError = function(fakeCall) {
  var errors = this._expectations
    .map('getError', fakeCall)
    .filter();

  return errors.first();
};

ExpectedCall.prototype.score = function(fakeCall) {
  var score = this._expectations
    .not('getError', fakeCall)
    .sum('score');

  return score;
};

ExpectedCall.prototype.hasPotential = function() {
  return this._expectations.some('hasPotential');
};

ExpectedCall.prototype.isSatisfied = function() {
  return this._expectations.every('isFulfilled');
};

ExpectedCall.prototype.fulfill = function(fakeCall) {
  this._calls.push(fakeCall);
  this._lastArgs.splice(0);
  this._lastArgs.push.apply(this._lastArgs, fakeCall.getArgs());

  this._expectations.each('fulfill', fakeCall);

  if (this._handler) {
    return this._handler.apply(fakeCall.getContext(), fakeCall.getArgs());
  }

  return this._return;
};

ExpectedCall.prototype.inspect = function() {
  var expectations = this._expectations._items
    .map(function(expectation) {
      return expectation.getType();
    })
    .join(', ');

  return '<ExpectedCall ' + expectations + '>';
};
