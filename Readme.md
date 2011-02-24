# Fake

Isolate your tests by faking anything outside of the function you are testing.

## Target Audience

This library is for those of you who wish to apply mathematical rigor to their
unit testing.

If you think a few smoke tests are all it takes to write good software, get
yourself some syntactical sugar & color highlighted output from the
competition.

## Overview

The goal for this module is to enable you to test **every** aspect of a piece
of JavaScript code.

This is accomplished by comining the following three classes.

* `Sandbox`: Allows you to load any piece of JavaScript code into an isolated
and pre-configured environment.
* `Scene`: Allows you to stub, mock and fake methods as well as defining the
order in which you expect them to be called.
* `Test`: Provides a simple test framework based on the two classes above. You
can choose to use this class, or just use the other two within your own system.

## Todo

* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple scenes
* NodeModuleScene / BrowserScriptScene?
