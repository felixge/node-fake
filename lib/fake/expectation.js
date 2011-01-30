var ExpectationDiff = require('./expectation_diff');

function Expectation(properties) {
  this._fakeFunction = null;

  this._minCalls = 1;
  this._maxCalls = 1;
  this._args = null;
  this._context = null;

  this._return = undefined;
  this._handler = null;

  this._lastArgs = [];
  this._calls = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Expectation;

Expectation.create = function(fakeFunction) {
  return new Expectation({
    _fakeFunction: fakeFunction,
  });
}

Expectation.prototype.withArgs = function() {
  this._args = Array.prototype.slice.call(arguments);
  return this;
};

Expectation.prototype.viaNew = function() {
  this._new = true;
  return this;
};

Expectation.prototype.inContext = function(context) {
  this._context = context;
  return this;
};

Expectation.prototype.andHandle = function(handler) {
  this._handler = handler;
};

Expectation.prototype.andReturn = function(val) {
  this._return = val;
  return this;
};

Expectation.prototype.times = function(min, max) {
  if (arguments.length === 1) {
    max = min;
  }

  this._minCalls = min;
  this._maxCalls = max;

  return this;
};

Expectation.prototype.hasPotential = function() {
  var callCount = this._calls.length;
  return (callCount < this._maxCalls);
};

Expectation.prototype.diff = function(fakeCall) {
  return ExpectationDiff.between(this, fakeCall);
};

Expectation.prototype.isSatisifed = function() {
  var callCount = this._calls.length;
  return (callCount >= this._minCalls && callCount <= this._maxCalls);
};

Expectation.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

Expectation.prototype.lastCall = function() {
  return this._calls[this._calls.length - 1];
};

Expectation.prototype.getArgs = function() {
  return this._lastArgs;
};

Expectation.prototype.fullfil = function(fakeCall) {
  this._calls.push(fakeCall);
  this._lastArgs.splice(0);
  this._lastArgs.push.apply(this._lastArgs, fakeCall.args());

  if (this._handler) {
    return this._handler.apply(fakeCall.context(), fakeCall.args());
  }

  return this._return;
};
