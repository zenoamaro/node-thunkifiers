thunkifiers ![](https://travis-ci.org/zenoamaro/node-thunkifiers.svg?branch=master)
==============================================================================
A set of thunkifiers which transform functions using various common callback styles into thunks, for use in generators or other control flow mechanisms.

Based on [thunkify] by [visionmedia], from which it inherits some code.

[thunkify]: https://github.com/visionmedia/node-thunkify
[visionmedia]: https://github.com/visionmedia


What is a thunk?
----------------
A _thunk_ is a wrapper around a function that expects or returns one or more callbacks.

It returns another function which expects a normalized _node-style_ callback, partially applied with the provided arguments.

~~~js
function original(arguments, done) {
    // ...
    done(null, 'ok')
}

function thunkified(arguments) {
    return function(done) {
        original(arguments, done)
    }
}
~~~

Thunks catch any exception thrown during the execution of both their wrapped function and the callback, and expose it as the `err` argument of the callback. 

Callbacks will be debounced to prevent additional "ghost calls". Note that this won't hold if errors are thrown during the callback itself, but you aren't really expected to be using thunks by themselves.

Thunks are a lightweight implementation of Futures which do not provide any mechanisms of [control flow]. As such, they are meant to be fed into generators or other systems which provide their own mechanisms.

For a more in-depth explanation and a comparison with Promises read [thunks vs promises].

[control flow]: http://en.wikipedia.org/wiki/Control_flow
[thunks vs promises]: https://github.com/visionmedia/co#thunks-vs-promises


Installation
------------
~~~
$ npm install thunkifiers
~~~


Included thunkifiers
--------------------
All thunkifiers expose the same interface:

    function thunkifier (
        function,
        [object context]
    )

The first argument being the function to thunkify, and optionally a `context` object to bind the wrapped function to, which defaults to the receiver on which the thunk is called.

They all return a thunk, which accepts any arguments and returns a partially applied lazy invocation.

    thunk(arguments...)
    // => function(done)


### Node-style error-first

    function thunkifiers.node (
        function (args..., done),
        [object context]
    )

A thunkifier for functions that accept a single `(err, arguments...)` callback. This includes most Node.js functions.

Wrapped functions will maintain their receiver as `this`, but you can optionally provide a specific `context` to bind them on.

~~~js
function read(filename, encoding, done) {
    // ...
    if (results)
        done(null, results)
    else
        done('error')
}

var thunkifiers = require('thunkifiers'),
    read = thunkifiers.node(read)

read('package.json', 'utf8')(function(err, str){
    // ...
})
~~~


### Branched callbacks for success and error

    function thunkifiers.branched (
        function (args..., success, error),
        [object context]
    )

A thunkifier for functions that accept a `(arguments...)` success callback and a `(error, error arguments...)` error callback.

Wrapped functions will maintain their receiver as `this`, but you can optionally provide a specific `context` to bind them on.

~~~js
function read(filename, encoding, success, error) {
    // ...
    if (results)
        success(results)
    else
        error('error')
}

var thunkifiers = require('thunkifiers'),
    read = thunkifiers.branched(read)

read('package.json', 'utf8')(function(err, str){
    // ...
})
~~~


### Promises

There isn't a thunkifier for promises yet. Pull requests are welcome.


License
-------

The MIT License (MIT)

Copyright (c) 2014, zenoamaro at gmail dot com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.