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

* `Scene`: Allows you to stub, mock and fake methods as well as defining the
order in which you expect them to be called.


## Todo

* Report non-matching anytime expectations if they are the closest match
* Allow registering scene objects after the fact
* Maybe rename the module to scene?
* Move stacktrace into own module
* Useful error reporting
* Partial arguments matching
* Become self-testing
* Documentation
* Handle fake functions being claimed by multiple scenes
* NodeModuleScene / BrowserScriptScene?
