var should = require('should');
var asyncLight = require('../index.js')
describe('asyncLight', function() {
    it('asyncLight  series runs function in series ', function(done) {
        var sharedObj = {};
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                return cb(null, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                return cb(null, commonStr);
            }, 1);
        };
        asyncLight.series([func1, func2], function(err, resultArr) {
            commonStr.should.equal('changedinfunc2');
            done();
        });
    });
    it('if One of the functions in async series array errors out ..other functions are not ran', function(done) {
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                var err = new Error('forced error');
                return cb(err, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                return cb(null, commonStr);
            }, 1);
        };
        asyncLight.series([func1, func2], function(err, resultArr) {
            commonStr.should.equal('changedinfunc1');
            err.message.should.equal('forced error');
            done();
        });
    });
    it('if One of the functions in async series array errors out ... returned result is null', function(done) {
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                var err = new Error('forced error');
                return cb(err, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                return cb(null, commonStr);
            }, 1);
        };
        asyncLight.series([func1, func2], function(err, resultArr) {
            var nullCheck = resultArr === null;
            nullCheck.should.equal(true);
            done();
        });
    });
    it('asyncLight parallel runs in parallel', function(done) {
        var sharedObj = {};
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                return cb(null, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                return cb(null, commonStr);
            }, 1);
        };
        asyncLight.parallel([func1, func2], function(err, resultArr) {
            commonStr.should.equal('changedinfunc1');
            done();
        });
    });
    it('if One of the functions in async parallel errors out ... other functions are not ran', function(done) {
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                return cb(null, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                var err = new Error('forced error');
                return cb(err, commonStr);
            }, 1);
        };
        asyncLight.series([func1, func2], function(err, resultArr) {
            commonStr.should.equal('changedinfunc2');
            err.message.should.equal('forced error');
            done();
        });
    });
    it('if One of the functions in async parallel errors out ... result returned is null', function(done) {
        var commonStr = 'original';
        var func1 = function(cb) {
            setTimeout(function() {
                commonStr = 'changedinfunc1';
                return cb(null, commonStr);
            }, 21);
        };
        var func2 = function(cb) {
            commonStr = 'changedinfunc2'
            setTimeout(function() {
                var err = new Error('forced error');
                return cb(err, commonStr);
            }, 1);
        };
        asyncLight.series([func1, func2], function(err, resultArr) {
            var nullCheck = resultArr === null;
            nullCheck.should.equal(true);
            done();
        });
    });
    it('asyncLight parallel returns an empty resultArr when the function array is empty', function(done) {
        asyncLight.parallel([], function(err, resultArr) {
            resultArr.should.eql([]);
            done();
        });
    });
    it('asyncLight series returns an empty resultArr when the function array is empty', function(done) {
        asyncLight.series([], function(err, resultArr) {
            resultArr.should.eql([]);
            done();
        });
    });
    it('asyncLight series allows passing variables from one function to another', function(done) {
        function func1(cb) {
            var result = 'something';
            var x = 'defined here';
            cb(null, x, result);
        }

        function func2(varPassed, cb) {
            var x = varPassed;
            cb(null, x, varPassed);
        }
        asyncLight.series([func1, func2], function(err, resultArr) {
            resultArr[1].should.be.eql('defined here');
            done();
        });
    });
    it('asyncSeries allows following callback signatures cb() , cb(err), cb(err,result), cb (err,any,number,of,arguments,result)', function(done) {
        asyncLight.series([

            function(callback) {
                callback(); // result null means '' is put in resultArr
            },
            function(callback) {
                var result = 'm the result 2'
                callback(null, 'three', result); // result is added to resultArr while 'three' is passed on
            },
            function(arg1, callback) {
                // arg1 is now 'three' 
                var result = arg1;
                callback(null, 'done1', 'done2', 'done3', 'done4', 'done5', result);
            },
            function(arg1, arg2, arg3, callback) {
                // arg1 will be 'done1' , arg2 will be 'done2' , arg3 will be 'done3'
                var result = arg1 + arg2 + arg3;
                callback(null, result);
            },
        ], function(err, resultArr) {
            resultArr.should.eql(['', 'm the result 2', 'three', 'done1done2done3']);
            done();
        });
    });
});