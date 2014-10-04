"use strict"

module.exports = {
	debounce: debounce,
}


/**
 * Prevents a function from being called twice.
 *
 * @param {Function} fn
 * @param {Object} context
 * @return {Function}
 * @api private
 */
function debounce (fn, context) {
	var called
	return function () {
		if (called) return; else called = true
		return fn.apply(context, arguments)
	}
}
