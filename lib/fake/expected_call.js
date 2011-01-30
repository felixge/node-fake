var ExpectationDiff = require('./expectation_diff');

function ExpectedCall(properties) {
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
module.exports = ExpectedCall;

ExpectedCall.create = function(fakeFunction) {
  return new ExpectedCall({
    _fakeFunction: fakeFunction,
  });
}

ExpectedCall.prototype.withArgs = function() {
  this._args = Array.prototype.slice.call(arguments);
  return this;
};

ExpectedCall.prototype.viaNew = function() {
  this._new = true;
  return this;
};

ExpectedCall.prototype.inContext = function(context) {
  this._context = context;
  return this;
};

ExpectedCall.prototype.andHandle = function(handler) {
  this._handler = handler;
};

ExpectedCall.prototype.andReturn = function(val) {
  this._return = val;
  return this;
};

ExpectedCall.prototype.times = function(min, max) {
  if (arguments.length === 1) {
    max = min;
  }

  this._minCalls = min;
  this._maxCalls = max;

  return this;
};

ExpectedCall.prototype.hasPotential = function() {
  var callCount = this._calls.length;
  return (callCount < this._maxCalls);
};

ExpectedCall.prototype.diff = function(fakeCall) {
  return ExpectationDiff.between(this, fakeCall);
};

ExpectedCall.prototype.isSatisifed = function() {
  var callCount = this._calls.length;
  return (callCount >= this._minCalls && callCount <= this._maxCalls);
};

ExpectedCall.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

ExpectedCall.prototype.lastCall = function() {
  return this._calls[this._calls.length - 1];
};

ExpectedCall.prototype.getArgs = function() {
  return this._lastArgs;
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
