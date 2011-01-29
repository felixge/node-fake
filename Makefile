SHELL := /bin/bash

test:
	@find -E test -regex '.+/test-.+\.js' | xargs -n 1 -t node

.PHONY: test

