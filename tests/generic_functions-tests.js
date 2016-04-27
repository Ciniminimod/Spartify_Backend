var testSubject = require('../generic_functions'); 

exports.getAll = function() {
    return [
        getTime_FormatTest,
        getDateTime_FormatTest,
        strIsEmpty_IsEmpty_Test,
        strIsEmpty_NotEmpty_Test,
        strIsEmpty_WhiteSpace_Test
    ]
}

function getTime_FormatTest(){
    var regex = /^[0-2]\d:\d\d:\d\d$/;
    return regex.test(testSubject.getTime());
}

function getDateTime_FormatTest() {
    var regex = /^\d{1,4}\/[0-1]\d\/[0-3]\d [0-2]\d:\d\d:\d\d$/;
    return regex.test(testSubject.getDateTime());
}

function strIsEmpty_IsEmpty_Test() {
    var stringToTest = "";
    return testSubject.strIsEmpty(stringToTest);
}

function strIsEmpty_NotEmpty_Test() {
    var stringToTest = "NOT EMPTY";
    return !testSubject.strIsEmpty(stringToTest);
}

function strIsEmpty_WhiteSpace_Test() {
    var stringToTest = "   ";
    return testSubject.strIsEmpty(stringToTest);
}