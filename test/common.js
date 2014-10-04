"use strict"

var should = require('should')
var debounce = require('../lib/common').debounce


describe('debounce(fn)', function () {

	it('should return a function', function () {
		function aFunction () {
			// Whatever
		}
		debounce(aFunction).should.be.a.Function
	})

	it('should not alter the behavior of the function', function () {
		function sum (a, b) {
			return a + b
		}
		debounce(sum)(1, 2).should.be.exactly(3)
		debounce(sum)(2, 3).should.be.exactly(5)
	})

	it('should not allow the function to be called more than once', function () {
		var probe = debounce(function () { calls++ })
		var calls = 0
		for (var i=0; i<3; i++) probe()
		calls.should.be.exactly(1)
	})

})