var ExpectedCall = require('./expected_call');
var Collection = require('./collection');
var FakeFunction = require('./fake_function');

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
  return this._expect(this._next, object, method);
};

Scene.prototype.expectAnytime = function(object, method) {
  return this._expect(this._anytime, object, method);
};

Scene.prototype._expect = function(list, object, method) {
  var viaNew = (object === 'new' && typeof method === 'function');
  if (viaNew) {
    object = method;
    method = null;
  }

  var fakeFunction = this.fakeFunction(object, method);

  var expectation = ExpectedCall.create(fakeFunction);
  if (viaNew) {
    expectation.viaNew();
  }

  list.add(expectation);

  return expectation;
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
  var unsatisifed = all.not('isSatisifed');

  //console.log(unsatisifed);
  if (unsatisifed.length) {
    throw new Error('Unsatisifed expectation(s)');
  }
};

Scene.prototype.reset = function() {
  this._next = new Collection();
  this._anytime = new Collection();
};

Scene.prototype._handleFakeCall = function(fakeCall) {
  var bestExpectation = this._getBestExpectation(this._anytime, fakeCall);

  if (bestExpectation) {
    return bestExpectation.fullfil(fakeCall);
  }

  var potentials = this._next.filter('hasPotential');
  if (!potentials.length) {
    throw new Error('unexpected call');
  }

  var diff = potentials
    .first()
    .diff(fakeCall);

  if (!diff.isAcceptable()) {
    throw diff._error;;
  }

  var expectation = diff.getExpectation();
  return expectation.fullfil(fakeCall);
};

Scene.prototype._getBestExpectation = function(list, fakeCall) {
  var bestDiff = list
    .filter('hasPotential')
    .map('diff', fakeCall)
    .sortDesc('compare')
    .first('isAcceptable');

  if (bestDiff) {
    return bestDiff.getExpectation();
  }
}
