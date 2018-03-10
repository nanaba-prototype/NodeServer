exports.AddRoutine = function (admin, response, responseManager) {

    tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}

    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    global.logManager.PrintLogMessage("RoutineManager", "AddRoutine", "add new routine data to database",
        global.defineManager.LOG_LEVEL_INFO)
}

exports.DelRoutine = function () {
    
}

exports.UpdateRoutine = function () {
    
}