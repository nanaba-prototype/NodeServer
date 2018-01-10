exports.createUser = function (userInfoData, admin, response) {
    global.logManager.PrintLogMessage("UserManager", "createUser", "recv data: " + JSON.stringify(userInfoData), global.defineManager.LOG_LEVEL_INFO)
    admin.auth().createUser({
        email: userInfoData["email"],
        password: userInfoData["password"],
        displayName: userInfoData["displayName"],
        disabled: false
    }).then(function (userRecord) {
        global.logManager.PrintLogMessage("UserManager", "createUser", "user created uid: " + userRecord.uid, global.defineManager.LOG_LEVEL_INFO)

        responseManager = require('../Utils/ResponseManager');
        createUserResult = {'uid': userRecord.uid}
        responseManager.TemplateOfResponse(createUserResult, global.defineManager.HTTP_SUCCESS, response)
    }).catch(function (error) {
        global.logManager.PrintLogMessage("UserManager", "createUser", "user create failed error: " + error, global.defineManager.LOG_LEVEL_ERROR)

        responseManager = require('../Utils/ResponseManager');
        createUserResult = {'uid': global.defineManager.NOT_AVAILABLE}
        responseManager.TemplateOfResponse(createUserResult, global.defineManager.HTTP_SERVER_ERROR, response)
    })
}

exports.getUserInfoAuth = function (uid, admin, response) {
    global.logManager.PrintLogMessage("UserManager", "getUserInfoAuth", "finding user: " + uid, global.defineManager.LOG_LEVEL_INFO)
    admin.auth().getUser(uid)
        .then(function (userRecord) {
            responseManager = require('../Utils/ResponseManager');
            userRecordData = userRecord.toJSON()
            getUserInfoResult = {
                'email': userRecordData['email'],
                'displayName': userRecordData['displayName']
            }
            global.logManager.PrintLogMessage("UserManager", "getUserInfoAuth", "user founded successfully data: " + JSON.stringify(getUserInfoResult), global.defineManager.LOG_LEVEL_INFO)
            responseManager.TemplateOfResponse(getUserInfoResult, global.defineManager.HTTP_SUCCESS, response)
        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("UserManager", "getUserInfoAuth", "finding user failed error: " + error, global.defineManager.LOG_LEVEL_ERROR)
            responseManager = require('../Utils/ResponseManager');

            getUserInfoResult = {
                'email': global.defineManager.NOT_AVAILABLE,
                'displayName': global.defineManager.NOT_AVAILABLE
            }
            responseManager.TemplateOfResponse(getUserInfoResult, global.defineManager.HTTP_SERVER_ERROR, response)
        })
}

exports.makeAuthToken = function (uid, admin, response) {
    global.logManager.PrintLogMessage("UserManager", "makeAuthToken", "make token user: " + uid, global.defineManager.LOG_LEVEL_INFO)
    admin.auth().createCustomToken(uid)
        .then(function (token) {
            global.logManager.PrintLogMessage("UserManager", "makeAuthToken", "token is rdy: " + token, global.defineManager.LOG_LEVEL_INFO)

            responseManager = require('../Utils/ResponseManager');
            makeAuthTokenResult = {
                'token': token
            }

            responseManager.TemplateOfResponse(makeAuthTokenResult, global.defineManager.HTTP_SUCCESS, response)
        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("UserManager", "makeAuthToken", "token is not rdy: " + error, global.defineManager.LOG_LEVEL_INFO)

            responseManager = require('../Utils/ResponseManager');
            tempResponse = {
                'token': global.defineManager.NOT_AVAILABLE
            }

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SERVER_ERROR, response)
        })
}

exports.checkToken = function (token, admin, response) {
    global.logManager.PrintLogMessage("UserManager", "checkToken", "is this available to use?", global.defineManager.LOG_LEVEL_INFO)
    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            uid = decodedToken.uid
            global.logManager.PrintLogMessage("UserManager", "checkToken", "token is verified: " + uid, global.defineManager.LOG_LEVEL_INFO)
            responseManager = require('../Utils/ResponseManager');
            checkTokenResult = {
                'uid': uid
            }
            responseManager.TemplateOfResponse(makeAuthTokenResult, global.defineManager.HTTP_SUCCESS, response)
        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("UserManager", "checkToken", "not available token", global.defineManager.LOG_LEVEL_ERROR)
            responseManager = require('../Utils/ResponseManager');
            tempResponse = {
                'uid': global.defineManager.NOT_AVAILABLE
            }

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SERVER_ERROR, response)
        })
}