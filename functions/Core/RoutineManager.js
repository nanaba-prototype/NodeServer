exports.AddRoutine = function (admin, response, responseManager, generateManager, bodyData) {

    tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)

    dateStr = new Date().toISOString()
    rid = generateManager.CreateHash(bodyData["uid"] + dateStr)

    global.logManager.PrintLogMessage("RoutineManager", "AddRoutine", "add new routine data to database rid: " + rid,
        global.defineManager.LOG_LEVEL_INFO)
}

exports.DelRoutine = function () {
    
}

exports.UpdateRoutine = function () {
    
}