function Expectation(properties) {
  this._fakeFunction = null;

  this._minCalls = 1;
  this._maxCalls = 1;
  this._args = null;

  this._lastArgs = [];

  this._calls = [];
  this._return = undefined;
  this._handler = null;

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

Expectation.prototype.isHungry = function() {
  var callCount = this._calls.length;
  return (callCount < this._maxCalls);
};

Expectation.prototype.isSatisifed = function() {
  var callCount = this._calls.length;
  return (callCount >= this._minCalls && callCount <= this._maxCalls);
};

Expectation.prototype.matches = function(fakeCall) {
  if (fakeCall.getFakeFunction() !== this._fakeFunction) {
    return new Error('Expected a different call');
  }

  if (this._new) {
    var context = fakeCall.context();
    var constructor = this._fakeFunction.getDelegator();

    if (!(context instanceof constructor)) {
      return new Error('Expected to be called with new.');
    }
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

Expectation.prototype.lastCall = function() {
  return this._calls[this._calls.length - 1];
};

Expectation.prototype.getArgs = function() {
  return this._lastArgs;
};

Expectation.prototype.withNew = function() {
  this._new = true;
  return this;
};

Expectation.prototype.withArgs = function() {
  this._args = Array.prototype.slice.call(arguments);
  return this;
};

Expectation.prototype.andHandle = function(handler) {
  this._handler = handler;
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
