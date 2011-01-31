var path = require('path');
var util = require('util');
var fs = require('fs');

var str = require('./str');

function Expectation(properties) {
  this._trace = null;

  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = Expectation;

Expectation.requireAll = function() {
  var dir = __dirname + '/expectation';

  return fs
    .readdirSync(dir)
    .filter(function(file) {
      return file.match(/_expectation\.js$/);
    })
    .map(function(file) {
      return require(dir + '/' + file);
    });
};

Expectation.getType = function() {
  return this.mapClassToMethod(this.name);
};

Expectation.mapClassToMethod = function(className) {
  var methodName = className;

  methodName = methodName.replace(/Expectation$/, '');
  methodName = methodName.substr(0, 1).toLowerCase() + methodName.substr(1);

  return methodName;
};

Expectation.prototype.getType = function() {
  return Expectation.mapClassToMethod(this.constructor.name);
};

Expectation.diff = function(expected, got) {
  if (got === expected) {
    return;
  }

  return ['Unexpected value', util.inspect(expected), util.inspect(got)];
};

Expectation.prototype._getError = function(fakeCall, expected, got) {
  var diff = this.constructor.diff(expected, got);
  if (!diff) {
    return;
  }

  var reason = diff.shift();
  expected = diff.shift();
  got = diff.shift();

  var template =
    '%s expectation from line %s in "%s" not met:\n' +
    '\n' +
    'Reason: %s\n' +
    'Expected: %s\n' +
    'Got: %s\n';

  var message = str.sprintf(
    template,
    this.getType(),
    this.getOriginLine(),
    this.getOriginFile(),
    reason,
    expected,
    got
  );

  return fakeCall.createErrorObject(message);
};

Expectation.prototype.getOriginLine = function() {
  return this._trace.first().getLineNumber();
};

Expectation.prototype.getOriginFile = function() {
  return path.basename(this.getOriginPath());
};

Expectation.prototype.getOriginPath = function() {
  return this._trace.first().getFileName();
};

//Expectation.prototype.getOriginSource = function() {
  //var contextLines = 5;
  //var path = this.getOriginPath();
  //var lineNumber = this.getOriginLine();

  //var source = fs.readFileSync(path, 'utf8');
  //var lines = source
    //.replace('\r\n', '\n')
    //.replace('\r', '\n')
    //.split('\n')
    //.slice(
      //lineNumber - ((contextLines + 1) / 2),
      //lineNumber + ((contextLines - 1) / 2)
    //)
    //.map(function(line, i) {
      //if (i === ((contextLines - 1) / 2)) {
        //return '--> '+line;
      //}

      //return '    '+line;
    //});

  //return lines.join('\n');
//};
