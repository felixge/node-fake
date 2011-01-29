var Expectation = require('./expectation');
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

Scene.prototype.expect = function(object, method) {
  return this._expect(this._next, object, method);
};

Scene.prototype.anytime = function(object, method) {
  return this._expect(this._anytime, object, method);
};

Scene.prototype._expect = function(list, object, method) {
  var withNew = (object === 'new' && typeof method === 'function');
  if (withNew) {
    object = method;
    method = null;
  }

  var fakeFunction = this.fakeFunction(object, method);

  var expectation = Expectation.create(fakeFunction);
  if (withNew) {
    expectation.withNew();
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
  var candiate = this._anytime
    .filter('isHungry')
    .not('matches', fakeCall)
    .first();

  if (candiate) {
    return candiate.fullfil(fakeCall);
  }

  var candiate = this._next
    .filter('isHungry')
    .first();

  if (!candiate) {
    throw new Error('unexpected call');
  }

  var error = candiate.matches(fakeCall);
  if (!error) {
    return candiate.fullfil(fakeCall);
  }

  throw error;
};
