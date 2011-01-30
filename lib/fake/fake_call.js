function FakeCall(properties) {
  this._context = null;
  this._args = [];
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
    _context: context,
    _args: args,
  });
};

FakeCall.prototype.getFakeFunction = function() {
  return this._fakeFunction;
};

FakeCall.prototype.getArgs = function(index) {
  if (index !== undefined) {
    return this._args[index];
  }

  return this._args;
};

FakeCall.prototype.getContext = function() {
  return this._context;
};

