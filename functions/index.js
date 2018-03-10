global.defineManager = require('./Global/DefineManager');
global.logManager = require('./Utils/LogManager');

//Firebase const value
const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Custom const value
const userManager = require('./Core/UserManager');
const responseManager = require('./Utils/ResponseManager');
const routineManager = require('./Core/RoutineManager');
const generateManager = require('./Utils/GenerateManager');

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

exports.createUser = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.searchRoutine = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
    // request.query.
        routineList = {}
        routineList["userPhoto"] = "user photo"
        routineList["userDisplayName"] = "user display name"
        routineList["age"] = 32
        routineList["routineName"] = "routine name"
        routineList["good"] = 15
        routineList["comment"] = 20
        routineList["isMyFavorite"] = true
        tempResponse = {
            "abcd": routineList

        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
else {
    tempResponse = {
        'msg': global.defineManager.MESSAGE_FAILED
    }

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.createRoutine = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    routineManager.AddRoutine(admin, response, responseManager, generateManager, request.body)
}
else {
    tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.infoRoutine = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
    // request.query.
    tempResponse = {
        "writeDate": "2018-01-24T00:00:00.000Z",
        "writer": "writer display name",
        "writerPhoto": "writer profile photo url link",
        "title": "title",
        "description": "description of this routine",
        "good": 20,
        "favorite": 25,
        "commentLength": 12,
        "time": [
            "AM"
        ],
        "season": [
            "Warm"
        ],
        "areYouUseThis": "Yes",
        "routineLength": 1,
        "steps": {
            "1": {
                "name": "this is step name",
                "frequency": [
                    "Daily", "As Needed"
                ],
                "rating": 4,
                "tags": [
                    "sample;example;"
                ],
                "advice": "this is advice",
                "productBrand": "this is product brand",
                "productName": "this is product name",
                "productPhoto": "this is product photo"
            }
        },
        "commentUser": {
            "cid": {
                "date": "2018-01-24T00:00:00.000Z",
                "positive": 12,
                "body": "this is comment body",
                "replyFor": "cid"
            }
        }
    }

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {
        'msg': global.defineManager.MESSAGE_FAILED
    }

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.goodRoutine = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.favoriteRoutine = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.checkComments = functions.https.onRequest((request, response) => {
    if(request.method == 'GET') {
    // request.query.
    tempResponse = {
        "cid":{
            "positive": 12,
            "userDisplayName": "user display name",
            "body": "this is comment body",
            "replyFor": "cid",
            "date": "2018-01-24T00:00:00.000Z"
        }
    }

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {
        'msg': global.defineManager.MESSAGE_FAILED
    }

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.addComment = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.favoriteComment = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});

exports.applyComment = functions.https.onRequest((request, response) => {
    if(request.method == 'POST' && request.get('content-type') == 'application/json') {
    // request.body, admin, response
    tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
else {
    tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
}
});