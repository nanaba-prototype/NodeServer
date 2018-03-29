exports.AddMyFavoriteRoutine = function () {
    global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
        "increase routine good point uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {

        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
                "there is something problem msg: " + error.message,
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}

exports.DelMyFavoriteRoutine = function () {
    global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
        "increase routine good point uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {

        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
                "there is something problem msg: " + error.message,
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}

exports.GetMyFavoriteRoutine = function () {
    global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
        "increase routine good point uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {

        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
                "there is something problem msg: " + error.message,
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}