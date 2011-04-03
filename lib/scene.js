var ExpectedCall = require('./expected_call');
var Collection = require('./collection');
var FakeFunction = require('./fake_function');
var FakeCall = require('./fake_call');
var FakeObject = require('./fake_object');
var StackTrace = require('./stack_trace');
var util = require('util');

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

  var trace = StackTrace.get(traceOrigin);
  var expectedCall = ExpectedCall.create();

  expectedCall.callee(trace, fakeFunction);
  expectedCall.times(trace, 1);

  if (viaNew) {
    expectedCall.viaNew(trace);
  }

  list.add(expectedCall);

  if (!object && !method) {
    return fakeFunction.getDelegator();
  }

  return expectedCall;
};

Scene.prototype.callback = function(name) {
  return this
    .fakeFunction(null, null, name)
    .getDelegator();
};

Scene.prototype.class = function(name) {
  return this.callback(name);
};

Scene.prototype.object = function(name) {
  return FakeObject.create(name);
};

Scene.prototype.fakeFunction = function(object, method, name) {
  var fn = (object && method)
    ? object[method]
    : object;

  var fakeFunction = this._functions.first('isDelegator', fn);
  if (fakeFunction) {
    return fakeFunction;
  }

  fakeFunction = FakeFunction.create(object, method, name);
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

  if (!unsatisifed.length) {
    return;
  }

  var fakeFunction = FakeFunction.create(this, 'verify');
  var fakeCall = FakeCall.create(fakeFunction, this, []);
  var firstError = unsatisifed.first().getError(fakeCall);

  throw firstError;
};

Scene.prototype.reset = function() {
  this._next = new Collection();
  this._anytime = new Collection();
};

Scene.prototype._handleFakeCall = function(fakeCall) {
  var anytimeCall = this._getBestAnytimeCall(fakeCall);

  if (anytimeCall) {
    return anytimeCall.fulfill(fakeCall);
  }

  var expectedCall = this._next
    .filter('hasPotential')
    .first();

  if (!expectedCall) {
    expectedCall = this._next
      .filter('isSatisfied')
      .last();
  }

  if (!expectedCall) {
    var error = fakeCall.createErrorObject(
      'Unexpected call to "' + fakeCall.getName() + '", no calls were expected.'
    );
    throw error;
  }

  var error = expectedCall.getError(fakeCall);

  if (error) {
    throw error;
  }

  return expectedCall.fulfill(fakeCall);
};

Scene.prototype._getBestAnytimeCall = function(fakeCall) {
 var e = this._anytime
    .filter('hasPotential')
    .not('getError', fakeCall)
    .sortDesc('score', fakeCall);

 return e.first();
}
