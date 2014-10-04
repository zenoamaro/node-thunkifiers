"use strict"

var should = require('should')
module.exports = testThunks


function testThunks(thunkify, thunks) {

	it('should work when sync', function (done) {
		var probe = {}
		var execute = thunkify(thunks.sync)
		function callback (err, result) {
			(err == null).should.be.true
			result.should.be.exactly(probe)
			done()
		}
		execute(probe)(callback)
	})

	it('should work when async', function (done) {
		var probe = {}
		var execute = thunkify(thunks.async)
		function callback (err, result) {
			(err == null).should.be.true
			result.should.be.exactly(probe)
			done()
		}
		execute(probe)(callback)
	})

	it('should maintain its receiver', function (done) {
		var receiver = {
			probe: {},
			execute: thunkify(thunks.withContext)
		}
		function callback (err, result) {
			(err == null).should.be.true
			result.should.be.exactly(receiver.probe)
			done()
		}
		receiver.execute('probe')(callback)
	})

	it('should maintain the given context', function (done) {
		var differentContext = {
			probe: {}
		}
		var receiver = {
			probe: {},
			execute: thunkify(thunks.withContext, differentContext)
		}
		function callback (err, result) {
			(err == null).should.be.true
			result.should.not.be.exactly(receiver.probe)
			result.should.be.exactly(differentContext.probe)
			done()
		}
		receiver.execute('probe')(callback)
	})

	it('should catch failures', function (done) {
		var failure = 'boom'
		var fail = thunkify(thunks.fails)
		function callback (err) {
			(err == null).should.be.false
			err.should.be.exactly(failure)
			done()
		}
		fail(failure)(callback)
	})

	it('should catch exceptions', function (done) {
		var failure = 'boom'
		var explode = thunkify(thunks.throws)
		function callback (err) {
			(err == null).should.be.false
			err.should.be.an.Error
			err.message.should.be.exactly(failure)
			done()
		}
		explode(failure)(callback)
	})

	it('should ignore multiple callbacks', function (done) {
		var hasExpired = false
		var execute = thunkify(thunks.bounces)
		function callback (err) {
			(err == null).should.be.true
			hasExpired.should.be.false
			hasExpired = true
			done()
		}
		execute()(callback)
	})

	it('should pass all results', function (done) {
		var probes = [ {}, {}, {} ]
		var execute = thunkify(thunks.manyArguments)
		function callback (err, a, b, c) {
			(err == null).should.be.true
			a.should.be.exactly(probes[0])
			b.should.be.exactly(probes[1])
			c.should.be.exactly(probes[2])
			done()
		}
		execute.apply(null, probes)(callback)
	})

}