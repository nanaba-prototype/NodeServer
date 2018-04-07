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
const commentManager = require('./Core/CommentManager');
const communityManager = require('./Core/CommunityManager');
const favoriteManager = require('./Core/FavoriteManager');

var serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nanaba-server.firebaseio.com/"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest(function (request, response) {
    global.logManager.PrintLogMessage("index", "helloWorld", "testing log manager", global.defineManager.LOG_LEVEL_INFO)

    tempResponse = {'msg': "Hello world!"}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
});

exports.signUp = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        userManager.createUser(request.body, admin, response)
    }
    else {
        tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.getUserInfoAuth = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "getUserInfoAuth", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.query["uid"] = decodedToken.uid
                uid = request.query["uid"]
                global.logManager.PrintLogMessage("index", "getUserInfoAuth", "req uid: " + uid, global.defineManager.LOG_LEVEL_INFO)
                userManager.getUserInfoAuth(request.query.uid, admin, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "getUserInfoAuth", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {
            'email': global.defineManager.NOT_AVAILABLE,
            'displayName': global.defineManager.NOT_AVAILABLE
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.makeAuthToken = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        uid = request.query.uid;
        if (typeof uid == 'undefined') {
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

exports.checkToken = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        token = request.query.token;
        if (typeof token == 'undefined') {
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

exports.createUser = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
    else {
        tempResponse = {'uid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.searchRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        // request.query.
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "searchRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.query["uid"] = decodedToken.uid
                routineManager.SearchRoutine(admin, response, responseManager, generateManager, request.query)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "searchRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {
            'msg': global.defineManager.MESSAGE_FAILED
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.createRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "createRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                routineManager.AddRoutine(admin, response, responseManager, generateManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "createRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.editRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "editRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                routineManager.UpdateRoutine(admin, response, responseManager, generateManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "editRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.deleteRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "deleteRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                routineManager.DelRoutine(admin, response, responseManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "deleteRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.infoRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        // request.query.
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "infoRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.query["uid"] = decodedToken.uid
                routineManager.GetDetailInfo(admin, response, responseManager, request.query)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "infoRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {
            'msg': global.defineManager.MESSAGE_FAILED
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.goodRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "goodRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                communityManager.IncreaseRoutineGoodPoint(admin, response, responseManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "goodRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.addFavoriteRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "addFavoriteRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                favoriteManager.AddMyFavoriteRoutine(admin, response, responseManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "addFavoriteRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.delFavoriteRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "delFavoriteRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "delFavoriteRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.getMyFavoriteRoutine = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "getMyFavoriteRoutine", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "getMyFavoriteRoutine", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.checkComments = functions.https.onRequest(function (request, response) {
    if (request.method == 'GET') {
        // request.query.
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.query["uid"] = decodedToken.uid
                tempResponse = {
                    "cid": {
                        "positive": 12,
                        "userDisplayName": "user display name",
                        "body": "this is comment body",
                        "replyFor": "cid",
                        "date": "2018-01-24T00:00:00.000Z"
                    }
                }

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {
            'msg': global.defineManager.MESSAGE_FAILED
        }

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.addComment = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "addComment", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                commentManager.addComment(admin, response, responseManager, generateManager, request.body)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "addComment", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.favoriteComment = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "favoriteComment", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "favoriteComment", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});

exports.applyComment = functions.https.onRequest(function (request, response) {
    if (request.method == 'POST' &&
        (request.get('content-type') == 'application/json' ||
        request.get('content-type') == 'application/x-www-form-urlencoded; charset=UTF-8')) {
        // request.body, admin, response
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.logManager.PrintLogMessage("index", "applyComment", "token verified uid: " + decodedToken.uid, global.defineManager.LOG_LEVEL_INFO)
                request.body["uid"] = decodedToken.uid
                tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
            })
            .catch(function (error) {
                global.logManager.PrintLogMessage("index", "applyComment", "cannot verify token", global.defineManager.LOG_LEVEL_ERROR)
                tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_UNAUTHORIZED, response)
            })
    }
    else {
        tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    }
});