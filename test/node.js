"use strict"

var thunkifiers = require('../lib')
var testThunks = require('./thunk')


describe('thunkifiers.node(fn)', function() {

	var thunkifier = thunkifiers.node

	function sync (argument, callback) {
		callback(null, argument)
	}

	function async (argument, callback) {
		setTimeout(function() {
			callback(null, argument)
		}, 5)
	}

	function withContext (property, callback) {
		callback(null, this[property])
	}

	function fails (message, callback) {
		callback(message)
	}

	function throws (message, callback) {
		throw new Error(message)
	}

	function bounces (callback) {
		callback(null)
		callback(null)
		callback(null)
	}

	function manyArguments (a, b, c, callback) {
		callback(null, a, b, c)
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