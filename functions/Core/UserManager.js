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