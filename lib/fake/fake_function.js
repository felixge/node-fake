var FakeCall = require('./fake_call');

function FakeFunction(properties) {
  this._object = null;
  this._method = null;
  this._originalHandler = null;
  this._delegate = null;
  this._delegator = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = FakeFunction;

FakeFunction.create = function(object, method) {
  return new FakeFunction({
    _object: object || null,
    _method: method || null,
  });
};

FakeFunction.prototype.setDelegate = function(delegate) {
  this._delegate = delegate;

  var self = this;
  this._delegator = function delegator() {
    var fakeCall = FakeCall.create(self, this, arguments);
    return delegate(fakeCall);
  };

  if (this._object) {
    this._originalHandler = this._object[this._method];
    this._object[this._method] = this._delegator;
  }
};

FakeFunction.prototype.getDelegator = function() {
  return this._delegator;
};

FakeFunction.prototype.isDelegator = function(delegator) {
  return this._delegator === delegator;
};

FakeFunction.prototype.releaseDelegate = function() {
  this._object[this._method] = this._originalHandler;
};
