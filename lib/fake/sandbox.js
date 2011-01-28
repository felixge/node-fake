var vm = require('vm');
var fs = require('fs');

function Sandbox(properties) {
  this._path = null;
  this._source = null;
  this._globals = {};
  this._locals = null;
  this._localContext = null;
}
module.exports = Sandbox;

Sandbox.prototype.load = function(path) {
  this._path = path;
  this._source = fs.readFileSync(path, 'utf8');
};

Sandbox.prototype.setGlobals = function(globals) {
  this._globals = globals;
};

Sandbox.prototype.setLocals = function(locals, context) {
  this._locals = locals || {};
  this._localContext = context || {};
};

Sandbox.prototype.compile = function(path) {
  if (path) {
    this.load(path);
  }

  if (!this._locals) {
    return this._compileInGlobalScope();
  }

  return this._compileInLocalScope();
};

Sandbox.prototype._compileInGlobalScope = function() {
  return vm.runInNewContext(this._source, this._globals, this._path);
};

Sandbox.prototype._compileInLocalScope = function() {
  var localVariables = [];
  var localValues = [];

  for (var localVariable in this._locals) {
    localVariables.push(localVariable);
    localValues.push(this._locals[localVariable]);
  }

  var source =
    '(function(' + localVariables.join(', ') + ') {' +
    this._source +
    '});';

  var fn = vm.runInNewContext(source, this._globals, this._path);
  return fn.apply(this._localContext, localValues);
};
