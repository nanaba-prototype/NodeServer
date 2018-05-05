exports.AddRoutine = function (admin, response, responseManager, generateManager, request) {

    userRecordData = request.userRecordData
    bodyData = request.body

    date = new Date()
    dateStr = date.toISOString()
    dateTimeSec = date.getTime() / 1000;
    // rid = generateManager.CreateHash(bodyData["uid"] + dateStr)
    newRoutineRef = admin.database().ref("/Routine/").push()
    rid = newRoutineRef.key
    uid = userRecordData["uid"]

    global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
        "add new routine data to database rid: " + rid + " display name: " + userRecordData['displayName'] + " uid: " + uid,
        global.defineManager.LOG_LEVEL_INFO)

    routineDataTemplate = {
        "areYouUseThis": "Yes",
        "commentLength": 0,
        "commentUser": {},
        "description": "",
        "favorite": 0,
        "favoriteUser": [],
        "good": 0,
        "routineLength": 0,
        "season": [],
        "steps": [],
        "time": [],
        "title": "",
        "uid": "",
        "uploadDate": "",
        "uploadDateTimeSec": 0,
        "writer": ""
    }

    routineDataTemplate["uid"] = uid
    routineDataTemplate["title"] = bodyData["title"]
    routineDataTemplate["description"] = bodyData["description"]
    routineDataTemplate["time"] = bodyData["time"]
    routineDataTemplate["season"] = bodyData["season"]
    routineDataTemplate["areYouUseThis"] = bodyData["areYouUseThis"]
    routineDataTemplate["routineLength"] = bodyData["routineLength"]
    routineDataTemplate["uploadDate"] = dateStr
    routineDataTemplate["uploadDateTimeSec"] = dateTimeSec
    routineDataTemplate["writer"] = userRecordData['displayName']

    stepsData = {}
    for (indexOfStep in bodyData["steps"]) {
        indexOfStepData = bodyData["steps"][indexOfStep]
        productBrand = indexOfStepData["productBrand"]
        productName = indexOfStepData["productName"]
        productPhoto = indexOfStepData["productPhoto"]

        // pid = generateManager.CreateHash(productName + dateStr)
        newProductRef = admin.database().ref("/Product/").push()
        pid = newProductRef.key

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

        status = newProductRef.set(productData);
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
            "save product data pid: " + pid + " status: " + status.message,
            global.defineManager.LOG_LEVEL_INFO)
    }

    routineDataTemplate["steps"] = stepsData

    status = newRoutineRef.set(routineDataTemplate);
    global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
        "save routine data rid: " + rid + " status: " + status.message,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref('/Users/' + uid + "/myRoutine/").once('value', function (snapshot) {
        databaseSnapshot = snapshot.val()
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
            "check myRoutine data: " + databaseSnapshot,
            global.defineManager.LOG_LEVEL_DEBUG)
        if (typeof databaseSnapshot == 'undefined' || databaseSnapshot == null) {
            databaseSnapshot = []
        }
        databaseSnapshot.push(
            {
                "rid": rid,
                "uploadDateTimeSec": dateTimeSec
            })
        status = admin.database().ref("/Users/" + uid + "/myRoutine/").set(databaseSnapshot);
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
            "save routine data uid: " + uid + " status: " + status.message,
            global.defineManager.LOG_LEVEL_INFO)

        tempResponse = {'rid': rid}
        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)

    })

}

exports.DelRoutine = function (admin, response, responseManager, deleteRoutineData) {
    admin.auth().getUser(deleteRoutineData["uid"])
        .then(function (userRecord) {
            userRecordData = userRecord.toJSON()
            global.logManager.PrintLogMessage("RoutineManager", "DelRoutine", "try to update routine uid: " + deleteRoutineData["uid"],
                global.defineManager.LOG_LEVEL_INFO)

            status = admin.database().ref("/Routine/" + deleteRoutineData["rid"] + "/").set(null);
            global.logManager.PrintLogMessage("RoutineManager", "DelRoutine",
                "delete routine data rid: " + deleteRoutineData["rid"] + " status: " + status.message,
                global.defineManager.LOG_LEVEL_INFO)
            tempResponse = {'msg': global.defineManager.MESSAGE_SUCCESS}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
        })

        .catch(function (error) {
            global.logManager.PrintLogMessage("RoutineManager", "DelRoutine",
                "not available user accepted",
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'rid': global.defineManager.NOT_AVAILABLE}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}

exports.UpdateRoutine = function (admin, response, responseManager, generateManager, editRoutineData) {
    admin.auth().getUser(editRoutineData["uid"])
        .then(function (userRecord) {
            userRecordData = userRecord.toJSON()
            dateStr = new Date().toISOString()

            admin.database().ref('/Routine/' + editRoutineData["rid"] + "/").once('value', function (snapshot) {
                databaseSnapshot = snapshot.val()
                global.logManager.PrintLogMessage("RoutineManager", "UpdateRoutine", "try to update routine uid: " + userRecordData["uid"],
                    global.defineManager.LOG_LEVEL_INFO)

                routineDataTemplate = {
                    "areYouUseThis": editRoutineData["areYouUseThis"],
                    "description": editRoutineData["description"],
                    "routineLength": editRoutineData["routineLength"],
                    "season": editRoutineData["season"],
                    "steps": {},
                    "time": editRoutineData["time"],
                    "title": editRoutineData["title"],
                }

                stepsData = {}
                for (indexOfStep in editRoutineData["steps"]) {
                    indexOfStepData = editRoutineData["steps"][indexOfStep]
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
                    global.logManager.PrintLogMessage("RoutineManager", "UpdateRoutine",
                        "save product data pid: " + pid + " status: " + status.message,
                        global.defineManager.LOG_LEVEL_INFO)
                }

                routineDataTemplate["steps"] = stepsData

                for(key in routineDataTemplate) {
                    databaseSnapshot[key] = routineDataTemplate[key]
                }

                status = admin.database().ref("/Routine/" + editRoutineData["rid"] + "/").set(databaseSnapshot);
                global.logManager.PrintLogMessage("RoutineManager", "UpdateRoutine",
                    "update routine data rid: " + editRoutineData["rid"] + " status: " + status.message,
                    global.defineManager.LOG_LEVEL_INFO)
                tempResponse = {'msg': global.defineManager.MESSAGE_SUCCESS}
                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
            })
        })
        .catch(function (error) {
            global.logManager.PrintLogMessage("RoutineManager", "UpdateRoutine",
                "not available user accepted",
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}

exports.SearchRoutine = function (admin, response, responseManager, generateManager, query) {
    global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
        "searching routine based on query options",
        global.defineManager.LOG_LEVEL_INFO)

    for (indexOfQuery in query) {
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

    admin.database().ref('/Routine').once('value', function (snapshot) {
        databaseSnapshot = snapshot.val()

        for (indexOfRoutine in databaseSnapshot) {
            routineList = {}

            indexOfRoutineData = databaseSnapshot[indexOfRoutine]
            global.logManager.PrintLogMessage("RoutineManager", "SearchRoutine",
                "searching target rid: " + indexOfRoutine,
                global.defineManager.LOG_LEVEL_INFO)

            if (indexOfRoutineData["writer"].includes(query["writer"])) {
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
        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
    });
}

exports.GetDetailInfo = function (admin, response, responseManager, query) {
    global.logManager.PrintLogMessage("RoutineManager", "GetDetailInfo",
        "getting detail info rid: " + query.rid,
        global.defineManager.LOG_LEVEL_INFO)
    admin.database().ref('/Routine/' + query.rid + "/").once('value', function (snapshot) {
        databaseSnapshot = snapshot.val()

        responseManager.TemplateOfResponse(databaseSnapshot, global.defineManager.HTTP_SUCCESS, response)
    })
}

exports.GetRoutineHistory = function (admin, response, responseManager, request) {
    targetUid = request.query.uid
    global.logManager.PrintLogMessage("RoutineManager", "GetDetailInfo",
        "getting detail info rid: " + targetUid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref('/Routine').orderByChild("uid").equalTo(targetUid)
        .limitToLast(10).on("value", function (snapshot) {
        responseManager.TemplateOfResponse(snapshot, global.defineManager.HTTP_SUCCESS, response)
    })
}