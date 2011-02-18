var ExpectationDiff = require('./expectation_diff');
var StackTrace = require('./stack_trace');
var Expectation = require('./expectation');
var Collection = require('./collection');

function ExpectedCall(properties) {
  this._fakeFunction = null;

  this._expectations = new Collection();

  this._minCalls = 1;
  this._maxCalls = 1;

  this._return = undefined;
  this._handler = null;

  this._lastArgs = [];
  this._calls = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = ExpectedCall;

ExpectedCall.create = function(fakeFunction) {
  return new ExpectedCall({
    _fakeFunction: fakeFunction,
  });
}

var expectations = Expectation.requireAll();
expectations.forEach(function(Expectation) {
  var type = Expectation.getType()

  ExpectedCall.prototype[type] = function() {
    var trace = StackTrace.get(arguments.callee);
    var args = [trace].concat(Array.prototype.slice.call(arguments));

    var expectation = Expectation.create.apply(null, args);

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
  var callCount = this._calls.length;
  return (callCount < this._maxCalls);
};

ExpectedCall.prototype.isSatisfied = function() {
  var callCount = this._calls.length;
  return (callCount >= this._minCalls && callCount <= this._maxCalls);
};

ExpectedCall.prototype.fullfil = function(fakeCall) {
  this._calls.push(fakeCall);
  this._lastArgs.splice(0);
  this._lastArgs.push.apply(this._lastArgs, fakeCall.getArgs());

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
