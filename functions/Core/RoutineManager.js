exports.AddRoutine = function (admin, response, responseManager, generateManager, bodyData) {

    dateStr = new Date().toISOString()
    rid = generateManager.CreateHash(bodyData["uid"] + dateStr)

    global.logManager.PrintLogMessage("RoutineManager", "AddRoutine", "add new routine data to database rid: " + rid,
        global.defineManager.LOG_LEVEL_INFO)

    routineDataTemplate = {
        "areYouUseThis" : "Yes",
        "commentLength" : 0,
        "commentUser" : {
        },
        "description" : "",
        "favorite" : 0,
        "favoriteUser" : [],
        "good" : 0,
        "routineLength" : 0,
        "season" : [],
        "steps" : [],
        "time" : [],
        "title" : "",
        "uid" : "",
        "uploadDate" : "",
        "writer" : ""
    }

    status = admin.database().ref("/Routine/" + rid + "/").set(routineDataTemplate);

    tempResponse = {'rid': rid}
    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
}

exports.DelRoutine = function () {
    
}

exports.UpdateRoutine = function () {
    
}