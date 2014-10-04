"use strict"

var thunkifiers = require('../lib')
var testThunks = require('./thunk')


describe('thunkifiers.branched(fn)', function() {

	var thunkifier = thunkifiers.branched

	function sync (argument, success, error) {
		success(argument)
	}

	function async (argument, success, error) {
		setTimeout(function() {
			success(argument)
		}, 5)
	}

	function withContext (property, success, error) {
		success(this[property])
	}

	function fails (message, success, error) {
		error(message)
	}

	function throws (message, success, error) {
		throw new Error(message)
	}

	function bounces (success, error) {
		success()
		success()
		success()
	}

	function manyArguments (a, b, c, success, error) {
		success(a, b, c)
	}

	return testThunks(thunkifier, {
		sync:  sync,
		async: async,
		withContext: withContext,
		fails: fails,
		throws: throws,
		bounces: bounces,
		manyArguments: manyArguments,
	})

})