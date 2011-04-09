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

Scene.prototype.expectNext = function(/* object, method, times, withArgs, andReturn */) {
  var params = this._mangleParams(arguments);
  return this._expect(this._next, params, arguments.callee);
};

Scene.prototype.expectAnytime = function(/* object, method, times, withArgs, andReturn */) {
  var params = this._mangleParams(arguments);
  return this._expect(this._anytime, params, arguments.callee);
};

Scene.prototype._mangleParams = function(args) {
  args = Array.prototype.slice.call(args);
  var params = {};

  params.object = args.shift();
  if (params.object === 'new') {
    params.object = args.shift();
    params.viaNew = true;
  } else {
    params.method = args.shift();
  }

  if (typeof args[0] === 'number') {
    params.times = args.shift();
  } else {
    params.times = 1;
  }

  if (typeof args[0] === 'function') {
    params.andHandle = args.shift();
  }

  params.withArgs = args.shift();

  if (typeof args[0] === 'function') {
    params.andHandle = args.shift();
    return params;
  }

  params.andReturn = args.shift();

  return params;
};

Scene.prototype._expect = function(list, params, traceOrigin) {
  var fakeFunction = this.fakeFunction(params.object, params.method);

  var trace = StackTrace.get(traceOrigin);
  var expectedCall = ExpectedCall.create();

  expectedCall.callee(trace, fakeFunction);
  expectedCall.times(trace, params.times);

  if (params.viaNew) {
    expectedCall.viaNew(trace);
  }

  if (params.withArgs) {
    expectedCall.withArgs.apply(expectedCall, [trace].concat(params.withArgs));
  }

  if (params.andHandle) {
    expectedCall.andHandle(params.andHandle);
  } else if (params.andReturn) {
    expectedCall.andReturn(params.andReturn);
  }

  list.add(expectedCall);

  if (!params.object && !params.method) {
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

Scene.prototype.function = function(name) {
  return this.callback(name);
};

Scene.prototype.object = function(name) {
  return FakeObject.create(name);
};

Scene.prototype.value = function(name) {
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

  var fakeFunctionObject = this._functions.first('isDelegator', object);
  if (fakeFunctionObject) {
    name = name || fakeFunctionObject.getName() + '#' + method;
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
  this._functions.each('restore');
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
      'Unexpected call "' + fakeCall.getSignature() + '"' +
      ', no calls were expected.'
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
};
