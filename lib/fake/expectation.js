function Expectation(properties) {
  this._fakeFunction = null;

  this._minCalls = 1;
  this._maxCalls = 1;
  this._args = null;

  this._lastArgs = [];

  this._calls = [];
  this._return = undefined;

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

Expectation.prototype.isSatisifed = function() {
  var callCount = this._calls.length;
  return (callCount >= this._minCalls && callCount <= this._maxCalls);
};

Expectation.prototype.matches = function(fakeCall) {
  if (fakeCall.getFakeFunction() !== this._fakeFunction) {
    return new Error('Expected a different call');
  }

  if (this._args) {
    var args = fakeCall.args();
    if (args.length !== this._args.length) {
      return new Error('Args count does not match');
    }

    for (var i = 0; i < args.length; i++) {
      if (args[i] !== this._args[i]) {
        return new Error('Expected different args');
      }
    }
  }
};

Expectation.prototype.getArgs = function() {
  return this._lastArgs;
};

Expectation.prototype.lastCall = function() {
  return this._calls[this._calls.length - 1];
};

Expectation.prototype.args = function(args) {
  this._args = args;
  return this;
};

Expectation.prototype.fullfil = function(fakeCall) {
  this._calls.push(fakeCall);
  this._lastArgs.splice(0);
  this._lastArgs.push.apply(this._lastArgs, fakeCall._args);
  return this._return;
};

Expectation.prototype.returnValue = function(val) {
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
