var util = require('util');

function FakeCall(properties) {
  this.args = [];
  this.context = null;

  this._fakeFunction = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = FakeCall;

FakeCall.create = function(fakeFunction, context, args) {
  args = Array.prototype.slice.call(args);

  return new FakeCall({
    _fakeFunction: fakeFunction,
    context: context,
    args: args,
  });
};

FakeCall.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

FakeCall.prototype.getName = function() {
  var name = this._fakeFunction.getName();

  if (this.viaNew()) {
    return 'new ' + name;
  }

  return name;
};

FakeCall.prototype.lastArg = function() {
  return this.args[this.args.length - 1];
};

FakeCall.prototype.getSignature = function() {
  var args = this.args
    .map(util.inspect)
    .join(', ');

  return this.getName() + '(' + args + ')';
};

FakeCall.prototype.viaNew = function() {
  var Constructor = this._fakeFunction.getDelegator();
  if (!Constructor) {
    return false;
  }

  var context = this.context;

  return context instanceof Constructor;
};

FakeCall.prototype.createErrorObject = function(msg) {
  var error = new Error(msg);
  Error.captureStackTrace(error, this._fakeFunction.getDelegator());
  return error;
};
