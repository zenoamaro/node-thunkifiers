"use strict"

var debounce = require('./common').debounce
module.exports = thunkify


/**
 * Wrap a _branched-style_ or _success-and-error_
 * call as a thunk.
 *
 * @param {Function} fn
 * @param {Object} context
 * @return {Function}
 * @api public
 */
function thunkify (fn, context) {
	if (typeof fn !== 'function')
		throw new TypeError('Expected function')

	return function (/*arguments...*/) {
		var args = arguments.length === 1 ?
			[arguments[0]] : Array.apply(null, arguments)
		// Maintain this context unless a custom one was given.
		var ctx = context != null? context : this

		return function (done) {
			var callback = debounce(done)
			// Normalize success callback to _error-first_.
			function success (/*results...*/) {
				var results = arguments.length === 1 ?
					[arguments[0]] : Array.apply(null, arguments)
				callback.apply(null, [null].concat( results ))
			}
			// Error callback is _error-first_ already.
			var error = callback
			args.push(success, error)

			try {
				fn.apply(ctx, args)
			} catch (err) {
				// NOTE: Errors thrown inside the callback itself
				//       will also get caught here, triggering
				//       a second execution of it.
				done(err)
			}
		}
	}
}