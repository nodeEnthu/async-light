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

