var chalk = require('chalk');
var allPassed = true;
var index;
var testsFailed = 0;

console.log('---- Beginning Tests ----');

/* 
Add tests in the section below, with the format being

var VARIABLENAME = require('LOCATION OF JAVASCRIPT FILE');
runTests(VARIABLENAME.getAll());

requirements of the JavaScript test file are:
- A set of functions returning true and false for pass and fail
- A getAll method similar to below, where exampleTest# are the names of the functions.

exports.getAll = function() {
    return [
        exampleTest1,
        exampleTest2,
        exampleTest3
    ]
}
---- Add Tests below here ---- */
var generic_functions = require('./generic_functions-tests');
runTests(generic_functions.getAll());

var config = require('./config-tests');
runTests(config.getAll());

/* ---- Add Tests above here ---- */

if(testsFailed == 0)
{
    console.log(chalk.green('All Tests Passed!'));
}
else if(testsFailed == 1)
{
    console.log(chalk.red('1 test has failed!'));
}
else
{
    console.log(chalk.red(testsFailed + ' tests have failed!'));
}

console.log('---- End of Tests ----');


function runTests(listOfTests)
{
    for (index = 0; index < listOfTests.length; ++index) {
        if(listOfTests[index]())
        { 
            console.log(chalk.green(functionName(listOfTests[index]) + ' Passed.'));
        }
        else
        {
            console.log(chalk.red(functionName(listOfTests[index]) + ' Failed.'));
            testsFailed++;
        }
    };
}

function functionName(func) {
  var ret = func.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}