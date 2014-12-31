'use strict';

module.exports = {
    parallel: function(funcArr, callback) {
        var pending = funcArr.length,
            resultArr = [];
        if (pending === 0) {
            return process.nextTick(callback.bind(null, null, resultArr));
        }
        funcArr.forEach(function(func, i) {
            func(function cb(error, result) {
                if (error) {
                    return callback(error, null);
                }
                resultArr[i] = result;
                pending = pending - 1;
                if (pending === 0) {
                    process.nextTick(callback.bind(null, null, resultArr));
                }
            });
        });
    },
    series: function(funcArr, callback) {
        var funcCount = funcArr.length;
        var resultArr = [];
        var index = 0;
        if (funcCount === 0) {
            return process.nextTick(callback.bind(null, null, resultArr));
        }

        function cb() {
            var memoizedArgs = [];
            if (arguments.length > 0) {
                if (arguments[0]) { // checking for err
                    return process.nextTick(callback.bind(null, arguments[0], null));
                }
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length - 1 >= 0) {
                    resultArr.push(args[args.length - 1]);
                    args.pop(); // taking out the cb argument
                } else {
                    resultArr.push('');
                }
                memoizedArgs = args; // overriding memoized args with new ones here
            } else {
                resultArr.push('');
                memoizedArgs = [];
            }
            ++index;
            process.nextTick(goToNext.bind(null, memoizedArgs));
        }

        function goToNext(memoizedArgs) {
            memoizedArgs = (memoizedArgs) ? memoizedArgs : [];
            if (index < funcCount) {
                var callbackIndex = funcArr[index].length - 1;
                memoizedArgs = memoizedArgs.slice(0, callbackIndex); // taking out the callback argument
                memoizedArgs.push(cb); //adding our own callback
                funcArr[index].apply(null, memoizedArgs); // this is where we are calling a given series function
            } else {
                return process.nextTick(callback.bind(null, null, resultArr));
            }
        }
        process.nextTick(goToNext.bind(null));
    }
};