global.defineManager = require('./Global/DefineManager');
global.logManager = require('./Utils/LogManager');

//Firebase const value
const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Custom const value
const userManager = require('./Core/UserManager');
const responseManager = require('./Utils/ResponseManager');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    global.logManager.PrintLogMessage("index", "helloWorld", "testing log manager", global.defineManager.LOG_LEVEL_INFO)

    tempResponse = {'msg': "Hello world!"}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
});

exports.signUp = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
        try {
            tempResponse = userManager.createUser(request.body)

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
        }
        catch(err) {
            tempResponse = {'msg': 500}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SERVER_ERROR, response)
        }
    }
    else {
        tempResponse = {'msg': 400}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});