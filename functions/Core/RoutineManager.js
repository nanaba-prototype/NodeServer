exports.AddRoutine = function (admin, response, responseManager, generateManager, bodyData) {

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {
            userRecordData = userRecord.toJSON()

            dateStr = new Date().toISOString()
            rid = generateManager.CreateHash(bodyData["uid"] + dateStr)

            global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                "add new routine data to database rid: " + rid + " display name: " + userRecordData['displayName'],
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

            routineDataTemplate["uid"] = bodyData["uid"]
            routineDataTemplate["title"] = bodyData["title"]
            routineDataTemplate["description"] = bodyData["description"]
            routineDataTemplate["time"] = bodyData["time"]
            routineDataTemplate["season"] = bodyData["season"]
            routineDataTemplate["areYouUseThis"] = bodyData["areYouUseThis"]
            routineDataTemplate["routineLength"] = bodyData["routineLength"]
            routineDataTemplate["uploadDate"] = dateStr
            routineDataTemplate["writer"] = userRecordData['displayName']

            stepsData = {}
            for(indexOfStep in bodyData["steps"]) {
                indexOfStepData = bodyData["steps"][indexOfStep]
                productBrand = indexOfStepData["productBrand"]
                productName = indexOfStepData["productName"]
                productPhoto = indexOfStepData["productPhoto"]

                pid = generateManager.CreateHash(productName + dateStr)

                stepsData[indexOfStep] = {
                    "advice": indexOfStepData["advice"],
                    "name": indexOfStepData["name"],
                    "frequency": indexOfStepData["frequency"],
                    "rating": indexOfStepData["rating"],
                    "tags": indexOfStepData["tags"],
                    "pid": pid
                }

                productData = {
                    "productBrand": productBrand,
                    "productName": productName,
                    "productPhoto": productPhoto
                }

                status = admin.database().ref("/Product/" + pid + "/").set(productData);
                global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                    "save product data pid: " + pid + " status: " + status.message,
                    global.defineManager.LOG_LEVEL_INFO)
            }

            routineDataTemplate["steps"] = stepsData

            status = admin.database().ref("/Routine/" + rid + "/").set(routineDataTemplate);
            global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                "save routine data rid: " + rid + " status: " + status.message,
                global.defineManager.LOG_LEVEL_INFO)

            tempResponse = {'rid': rid}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                "not available user accepted",
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })

}

exports.DelRoutine = function () {
    
}

exports.UpdateRoutine = function () {
    
}

exports.SearchRoutine = function () {
    
}