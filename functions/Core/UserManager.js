exports.createUser = function (userInfoData) {
    global.logManager.PrintLogMessage("UserManager", "createUser", "recv data: " + JSON.stringify(userInfoData), global.defineManager.LOG_LEVEL_INFO)
}