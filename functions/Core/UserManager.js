exports.createUser = function (userInfoData, admin, response) {
    global.logManager.PrintLogMessage("UserManager", "createUser", "recv data: " + JSON.stringify(userInfoData), global.defineManager.LOG_LEVEL_INFO)

    displayNameStr = ""
    if(userInfoData["displayName"] == null) {
        displayNameStr = userInfoData["email"].split("@")[0]
        global.logManager.PrintLogMessage("UserManager", "createUser", "user display name is null temp name: " + displayNameStr,
            global.defineManager.LOG_LEVEL_WARN)
    }

    admin.auth().createUser({
        email: userInfoData["email"],
        password: userInfoData["password"],
        displayName: displayNameStr,
        disabled: false
    }).then(function (userRecord) {
        global.logManager.PrintLogMessage("UserManager", "createUser", "user creating uid: " + userRecord.uid, global.defineManager.LOG_LEVEL_INFO)

        responseManager = require('../Utils/ResponseManager');
        createUserResult = {'uid': userRecord.uid}

        userInfoDataSave = {
            "email": userInfoData["email"],
            "displayName": displayNameStr,
            "sex": userInfoData["sex"],
            "birthYear": userInfoData["birthYear"],
            "ethnicity": userInfoData["ethnicity"],
            "location": userInfoData["location"],
            "makeUpDays": userInfoData["makeUpDays"],
            "sleepTimeAvg": userInfoData["sleepTimeAvg"],
            "skinType": userInfoData["skinType"] || [],
            "skinConcern": userInfoData["skinConcern"] || [],
            "allergy": userInfoData["allergy"],
            "photo": userInfoData["photo"] || ""
        }
        admin.database().ref("/Users/" + userRecord.uid + "/").set(userInfoDataSave);
        global.logManager.PrintLogMessage("UserManager", "createUser", "user data saved uid: " + userRecord.uid, global.defineManager.LOG_LEVEL_INFO)

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
            userInfoTemplate = {
                "allergy": null,
                "birthYear": null,
                "displayName": null,
                "email": null,
                "ethnicity": null,
                "favoriteRoutine": null,
                "location": null,
                "makeUpDays": null,
                "myRoutine": null,
                "photo": null,
                "sex": null,
                "skinConcern": null,
                "skinType": null,
                "sleepTimeAvg": null
            }
            global.logManager.PrintLogMessage("UserManager", "getUserInfoAuth", "user founded successfully data: " + JSON.stringify(getUserInfoResult), global.defineManager.LOG_LEVEL_INFO)
            admin.database().ref('/Users/' + uid + "/").once('value', function (snapshot) {
                databaseSnapshot = snapshot.val()
                userInfoTemplate["allergy"] = databaseSnapshot["allergy"]
                userInfoTemplate["birthYear"] = databaseSnapshot["birthYear"]
                userInfoTemplate["displayName"] = databaseSnapshot["displayName"]
                userInfoTemplate["email"] = databaseSnapshot["email"]
                userInfoTemplate["ethnicity"] = databaseSnapshot["ethnicity"]
                userInfoTemplate["favoriteRoutine"] = databaseSnapshot["favoriteRoutine"] || []
                userInfoTemplate["location"] = databaseSnapshot["location"]
                userInfoTemplate["makeUpDays"] = databaseSnapshot["makeUpDays"]
                userInfoTemplate["myRoutine"] = databaseSnapshot["myRoutine"] || []
                userInfoTemplate["photo"] = databaseSnapshot["photo"]
                userInfoTemplate["sex"] = databaseSnapshot["sex"]
                userInfoTemplate["skinConcern"] = databaseSnapshot["skinConcern"] || []
                userInfoTemplate["skinType"] = databaseSnapshot["skinType"] || []
                userInfoTemplate["sleepTimeAvg"] = databaseSnapshot["sleepTimeAvg"]

                responseManager.TemplateOfResponse(userInfoTemplate, global.defineManager.HTTP_SUCCESS, response)
            })
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