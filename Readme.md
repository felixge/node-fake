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

This is done by providing a sandbox system that lets you prepare any kind of
environment for your source file before loading it.

Once you have loaded the source file you are testing, you can create a scene
object that lets you describe and fake the collaboration of the function under
test with other functions and objects.

Let's say you want to test this


    var fake = require('fake');

## Todo

* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple scenes
* NodeModuleScene / BrowserScriptScene?
