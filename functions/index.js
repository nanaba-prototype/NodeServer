global.defineManager = require('./Global/DefineManager');
global.logManager = require('./Utils/LogManager');

//Firebase const value
const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Custom const value
const userManager = require('./Core/UserManager');
const responseManager = require('./Utils/ResponseManager');

var serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nanaba-server.firebaseio.com/"
});

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
        userManager.createUser(request.body, admin, response)
    }
    else {
        tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.getUserInfoAuth = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
        uid = request.query.uid;
        if(typeof uid == 'undefined') {
            tempResponse = {
                'email': global.defineManager.NOT_AVAILABLE,
                'displayName': global.defineManager.NOT_AVAILABLE
            }

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        }
        else {
            global.logManager.PrintLogMessage("index", "getUserInfoAuth", "req uid: " + uid, global.defineManager.LOG_LEVEL_INFO)
            userManager.getUserInfoAuth(request.query.uid, admin, response)
        }
    }
    else {
        tempResponse = {
            'email': global.defineManager.NOT_AVAILABLE,
            'displayName': global.defineManager.NOT_AVAILABLE
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.makeAuthToken = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
        uid = request.query.uid;
        if(typeof uid == 'undefined') {
            tempResponse = {
                'token': global.defineManager.NOT_AVAILABLE
            }

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        }
        else {
            global.logManager.PrintLogMessage("index", "makeAuthToken", "req uid: " + uid, global.defineManager.LOG_LEVEL_INFO)
            userManager.makeAuthToken(request.query.uid, admin, response)
        }
    }
    else {
        tempResponse = {
            'token': global.defineManager.NOT_AVAILABLE
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.checkToken = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
        token = request.query.token;
        if(typeof token == 'undefined') {
            tempResponse = {
                'uid': global.defineManager.NOT_AVAILABLE
            }

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        }
        else {
            global.logManager.PrintLogMessage("index", "checkToken", "checking token: " + token, global.defineManager.LOG_LEVEL_INFO)
            userManager.checkToken(token, admin, response)
        }
    }
    else {
        tempResponse = {
            'uid': global.defineManager.NOT_AVAILABLE
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});