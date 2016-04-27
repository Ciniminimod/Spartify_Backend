var testSubject = require('../config'); 

exports.getAll = function() {
    return [
        getConfig_Test
    ]
}

function getConfig_Test(){
    return testSubject.appName === 'Spartify Backend';
}