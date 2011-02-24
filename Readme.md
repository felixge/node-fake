**Current Status:** This library is currently under development. Do not use it yet.

# Fake

Test one thing at a time, fake the rest.

## Target Audience

This library is for those of you who wish to apply mathematical rigor to their
unit testing.

## Overview

The goal for this module is to enable you to test **every** aspect of a piece
of JavaScript code.

This is accomplished by combining the following three classes.

* `Sandbox`: Allows you to load any piece of JavaScript code into an isolated
and pre-configured environment.
* `Scene`: Allows you to stub, mock and fake methods as well as defining the
order in which you expect them to be called.
* `Test`: Provides a simple test framework based on the two classes above. This
class is entirely optional.

## Todo

* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple scenes
* NodeModuleScene / BrowserScriptScene?
