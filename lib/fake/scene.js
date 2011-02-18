var ExpectedCall = require('./expected_call');
var Collection = require('./collection');
var FakeFunction = require('./fake_function');
var StackTrace = require('./stack_trace');

function Scene(properties) {
  this._anytime = new Collection();
  this._next = new Collection();

  this._functions = new Collection();
  this._calls = [];

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Scene;

Scene.prototype.expectNext = function(object, method) {
  return this._expect(this._next, object, method, arguments.callee);
};

Scene.prototype.expectAnytime = function(object, method) {
  return this._expect(this._anytime, object, method, arguments.callee);
};

Scene.prototype._expect = function(list, object, method, traceOrigin) {
  var viaNew = (object === 'new' && typeof method === 'function');
  if (viaNew) {
    object = method;
    method = null;
  }

  var fakeFunction = this.fakeFunction(object, method);

  var expectedCall = ExpectedCall.create(fakeFunction);
  if (viaNew) {
    expectedCall.viaNew(StackTrace.get(traceOrigin));
  }

  list.add(expectedCall);

  return expectedCall;
};

Scene.prototype.callback = function() {
  return this
    .fakeFunction()
    .getDelegator();
};

Scene.prototype.class = function() {
  return this.callback();
};

Scene.prototype.fakeFunction = function(object, method) {
  var fn = (object && method)
    ? object[method]
    : object;

  var fakeFunction = this._functions.first('isDelegator', fn);
  if (fakeFunction) {
    return fakeFunction;
  }

  fakeFunction = FakeFunction.create(object, method);
  this._functions.add(fakeFunction);

  var self = this;
  fakeFunction.setDelegate(function(fakeCall) {
    return self._handleFakeCall(fakeCall);
  });

  return fakeFunction;
};

Scene.prototype.verify = function() {
  var all = this._anytime.concat(this._next);
  var unsatisifed = all.not('isSatisfied');

  if (unsatisifed.length) {
    throw new Error('Unsatisfied expectation(s)');
  }
};

Scene.prototype.reset = function() {
  this._next = new Collection();
  this._anytime = new Collection();
};

Scene.prototype._handleFakeCall = function(fakeCall) {
  var anytimeCall = this._getBestAnytimeCall(fakeCall);

  if (anytimeCall) {
    return anytimeCall.fullfil(fakeCall);
  }

  var expectedCall = this._next
    .filter('hasPotential')
    .first();

  if (!expectedCall) {
    throw new Error('unexpected call');
  }

  var error = expectedCall.getError(fakeCall);

  if (error) {
    throw error;
  }

  return expectedCall.fullfil(fakeCall);
};

Scene.prototype._getBestAnytimeCall = function(fakeCall) {
 var e = this._anytime
    .filter('hasPotential')
    .not('getError', fakeCall)
    .sortDesc('score', fakeCall);

 return e.first();
}
