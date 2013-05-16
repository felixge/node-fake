**Current Status:** This library is ready for experimental usage.

# Fake [![Build Status](https://travis-ci.org/alexindigo/node-fake.png?branch=master)](https://travis-ci.org/alexindigo/node-fake)

Test one thing at a time, fake the rest.

## Tutorial

Set an expectation of a method call on an object:

``` javascript
var fake = require('fake')();
var object = {};

fake.expect(object, 'method');

object.method();
```

If the last `object.method()` call is not present, an exception will be thrown.

Depending on your [approach to TDD][mocksvsstubs], you may prefer to use
stubbing over mocking instead:

[mocksvsstubs]: http://martinfowler.com/articles/mocksArentStubs.html

``` javascript
var fake = require('fake')();
var object = {};

var objectMethodCall = fake.stub(object, 'method');

object.method();

assert.equals(objectMethodCall.calls.length, 1);
```

## API

### fake.expect(object, method, [times, withArgs, andReturn | andHandle])

Set up an ordered expectation. Calling any other methods controlled by fake
before this expectation has been satisifed will throw an exception.

### fake.expectAnytime(object, method, [times, withArgs, andReturn | andHandle])

Set up an unordered expectation. This will only throw an error if this
expectation is not verified before the process exits.

### fake.stub(object, method, [times, withArgs, andReturn | andHandle])

Set up an optional expectation. This is useful for pre-filling return values
for functions, without caring if the function is ever called.

## Todo

* Report non-matching anytime expectations if they are the closest match
* Move stacktrace into own module
* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple fakes
* NodeModuleScene / BrowserScriptScene?
