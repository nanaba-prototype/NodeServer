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

            admin.database().ref('/Users/' + bodyData["uid"] + "/myRoutine/").once('value', (snapshot) => {
                databaseSnapshot = snapshot.val()
                global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                    "check myRoutine data: " + databaseSnapshot,
                    global.defineManager.LOG_LEVEL_DEBUG)
                if(typeof databaseSnapshot == 'undefined' || databaseSnapshot == null) {
                    databaseSnapshot = []
                }
                databaseSnapshot.push(rid)
                status = admin.database().ref("/Users/" + bodyData["uid"] + "/myRoutine/").set(databaseSnapshot);
                global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
                    "save routine data uid: " + bodyData["uid"] + " status: " + status.message,
                    global.defineManager.LOG_LEVEL_INFO)

                tempResponse = {'rid': rid}
                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)

            })
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

exports.SearchRoutine = function (admin, response, responseManager, generateManager, query) {
    global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
        "searching routine based on query options",
        global.defineManager.LOG_LEVEL_INFO)

    for(indexOfQuery in query) {
        global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
            "index of query: " + indexOfQuery + " val: " + query[indexOfQuery],
            global.defineManager.LOG_LEVEL_INFO)
    }


    // routineList["userPhoto"] = "user photo"
    // routineList["userDisplayName"] = "user display name"
    // routineList["age"] = 32
    // routineList["routineName"] = "routine name"
    // routineList["good"] = 15
    // routineList["comment"] = 20
    // routineList["isMyFavorite"] = true
    tempResponse = {
        // "abcd": routineList
    }

    admin.database().ref('/Routine').once('value', (snapshot) => {
        databaseSnapshot = snapshot.val()

        for(indexOfRoutine in databaseSnapshot) {
            routineList = {}

            indexOfRoutineData = databaseSnapshot[indexOfRoutine]
            global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
                "searching target rid: " + indexOfRoutine,
                global.defineManager.LOG_LEVEL_INFO)

            if(indexOfRoutineData["writer"] == query["writer"]) {
                routineList["userPhoto"] = "user photo"
                routineList["userDisplayName"] = indexOfRoutineData["wirter"]
                routineList["age"] = global.defineManager.NOT_AVAILABLE
                routineList["routineName"] = indexOfRoutineData["title"]
                routineList["good"] = indexOfRoutineData["good"]
                routineList["comment"] = indexOfRoutineData["commentLength"]
                routineList["isMyFavorite"] = false

                global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
                    "rid: " + indexOfRoutine + " detected same writer: " + indexOfRoutineData["writer"],
                    global.defineManager.LOG_LEVEL_INFO)

                tempResponse[indexOfRoutine] = routineList
            }
        }
        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
    });
}