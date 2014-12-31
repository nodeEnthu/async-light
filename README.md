async-light
===========

provides standard series and parallel functionality with the addition that series allows passing variables from one function to another wihtout corruption global ws 

### motivation
 a. working with medium sized app found that this is the only piece of functionality I wanted 
 
 b. pretty small code base
 

### tests (npm test)

    ✓ asyncLight  series runs function in series  
    ✓ if One of the functions in async series array errors out ..other functions are not ran 
    ✓ if One of the functions in async series array errors out ... returned result is null 
    ✓ asyncLight parallel runs in parallel 
    ✓ if One of the functions in async parallel errors out ... other functions are not ran 
    ✓ if One of the functions in async parallel errors out ... result returned is null 
    ✓ asyncLight parallel returns an empty resultArr when the function array is empty 
    ✓ asyncLight series returns an empty resultArr when the function array is empty 
    ✓ asyncLight series allows passing variables from one function to another 
    ✓ asyncSeries allows following callback signatures cb() , cb(err), cb(err,result), cb (err,any,number,of,arguments,result)

### exmaple of seires passing variables

    it('asyncSeries allows following callback signatures cb() , cb(err), cb(err,result), cb(err,any,number,of,arguments,result)', 
    function(done) {
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
