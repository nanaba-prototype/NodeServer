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
        "writer": "",
        "sex": "",
        "skinConcern": [],
        "skinType": [],
        "birthYear": 0
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
            "check myRoutine data: " + JSON.stringify(databaseSnapshot),
            global.defineManager.LOG_LEVEL_DEBUG)
        if (typeof databaseSnapshot == 'undefined' || databaseSnapshot == null) {
            databaseSnapshot = []
        }
        databaseSnapshot.push(
            {
                "rid": rid,
                "uploadDateTimeSec": dateTimeSec
            })

        global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
            "now myRoutine data: " + JSON.stringify(databaseSnapshot),
            global.defineManager.LOG_LEVEL_DEBUG)
        status = admin.database().ref("/Users/" + uid + "/myRoutine/").set(databaseSnapshot);
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutine",
            "save routine data uid: " + uid + " status: " + status.message,
            global.defineManager.LOG_LEVEL_INFO)

        admin.database().ref(global.defineManager.DATABASE_USERS_PATH + "/" + uid).once('value', function (userSnapshot) {
            userSnapshot = JSON.parse(JSON.stringify(userSnapshot))
            sex = userSnapshot["sex"]
            skinConcern = userSnapshot["skinConcern"]
            skinType = userSnapshot["skinType"]
            birthYear = userSnapshot["birthYear"]

            global.logManager.PrintLogMessage("RoutineManager", "AddRoutine", "attach routine search options", global.defineManager.LOG_LEVEL_INFO)
            global.logManager.PrintLogMessage("RoutineManager", "AddRoutine", "sex: " + sex + " skinConcern: " + skinConcern + " skinType: " + skinType + " birthYear: " + birthYear, global.defineManager.LOG_LEVEL_DEBUG)

            admin.database().ref(global.defineManager.DATABASE_ROUTINE_PATH + "/" + rid + "/sex").set(sex)
            admin.database().ref(global.defineManager.DATABASE_ROUTINE_PATH + "/" + rid + "/skinConcern").set(skinConcern)
            admin.database().ref(global.defineManager.DATABASE_ROUTINE_PATH + "/" + rid + "/skinType").set(skinType)
            admin.database().ref(global.defineManager.DATABASE_ROUTINE_PATH + "/" + rid + "/birthYear").set(Number(birthYear))

            tempResponse = {'rid': rid}
            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
        })
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

exports.GetRoutineHistoryAsRidList = function (admin, response, responseManager, request) {
    targetUid = request.query.uid
    showLimit = Number(request.query.limit) || global.defineManager.QUERY_RETURN_LIMIT

    global.logManager.PrintLogMessage("RoutineManager", "GetRoutineHistoryAsRidList",
        "getting detail info rid: " + targetUid,
        global.defineManager.LOG_LEVEL_INFO)



    admin.database().ref('/Users/' + targetUid + "/myRoutine").orderByChild("uploadDateTimeSec")
        .limitToLast(showLimit).on("value", function (snapshot) {
            snapshotStr = JSON.stringify(snapshot)
        global.logManager.PrintLogMessage("RoutineManager", "GetRoutineHistoryAsRidList",
            "routine history string: " + snapshotStr,
            global.defineManager.LOG_LEVEL_DEBUG)

        responseManager.TemplateOfResponse(snapshot, global.defineManager.HTTP_SUCCESS, response)
    })
}

exports.GetRoutineHistoryInfo = function (admin, response, responseManager, request) {
    targetRid = request.query.rid

    global.logManager.PrintLogMessage("RoutineManager", "GetRoutineHistoryInfo",
        "getting detail info rid: " + targetRid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref('/Routine/' + targetRid + "/").on("value", function (snapshot) {
        global.logManager.PrintLogMessage("RoutineManager", "GetRoutineHistoryInfo",
            "target routine info: " + JSON.stringify(snapshot),
            global.defineManager.LOG_LEVEL_INFO)

        routineData = JSON.parse(JSON.stringify(snapshot))
        routineInfoData = {
            "date": routineData["uploadDate"],
            "title": routineData["title"],
            "rating": Math.floor(0 / global.defineManager.ROUTINE_RATING_MAX),
            "good": routineData["good"],
            "favorite": routineData["favorite"],
            "rid": targetRid
        }

        responseManager.TemplateOfResponse(routineInfoData, global.defineManager.HTTP_SUCCESS, response)
    })
}

exports.GetRoutineDetailInfo = function (admin, response, responseManager, request) {
    targetRid = request.query.rid

    global.logManager.PrintLogMessage("RoutineManager", "GetRoutineDetailInfo",
        "getting detail info rid: " + targetRid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref('/Routine/' + targetRid + "/").on("value", function (routineInfoSnapshot) {

        routineInfoSnapshot = JSON.stringify(routineInfoSnapshot)

        global.logManager.PrintLogMessage("RoutineManager", "GetRoutineDetailInfo",
            "target routine info: " + routineInfoSnapshot,
            global.defineManager.LOG_LEVEL_INFO)

        routineInfoSnapshot = JSON.parse(routineInfoSnapshot)

        routineDetailData = {
            "areYouUseThis": routineInfoSnapshot["areYouUseThis"],
            "commentLength": global.defineManager.NOT_AVAILABLE,
            "description": routineInfoSnapshot["description"],
            "favorite": routineInfoSnapshot["favorite"],
            "good": routineInfoSnapshot["good"],
            "routineLength": routineInfoSnapshot["routineLength"],
            "season": routineInfoSnapshot["season"],
            "time": routineInfoSnapshot["time"],
            "title": routineInfoSnapshot["title"],
            "uploadDate": routineInfoSnapshot["uploadDate"],
            "writer": routineInfoSnapshot["writer"],
            "steps": routineInfoSnapshot["steps"]
        }

        responseManager.TemplateOfResponse(routineDetailData, global.defineManager.HTTP_SUCCESS, response)
    })
}

exports.IncreaseRoutineGood = function (admin, request, response, responseManager) {
    targetRid = request.body.rid

    if(targetRid == null) {
        global.logManager.PrintLogMessage("RoutineManager", "IncreaseRoutineGood",
            "if you want increase routine good, then you must give us rid", global.defineManager.LOG_LEVEL_WARN)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }

    global.logManager.PrintLogMessage("RoutineManager", "IncreaseRoutineGood",
        "increase routine good rid: " + targetRid,
        global.defineManager.LOG_LEVEL_INFO)

    targetRoutinePath = global.defineManager.DATABASE_ROUTINE_PATH + "/" + targetRid + global.defineManager.DATABASE_ROUTINE_GOOD_PATH
    global.logManager.PrintLogMessage("RoutineManager", "IncreaseRoutineGood", "target routine path: " + targetRoutinePath,
            global.defineManager.LOG_LEVEL_DEBUG)

    routineGoodRef = admin.database().ref(targetRoutinePath)
    routineGoodRef.transaction(function (good) {
        global.logManager.PrintLogMessage("RoutineManager", "IncreaseRoutineGood",
            "previous good: " + good, global.defineManager.LOG_LEVEL_DEBUG)

        return (good || 0) + 1
    })


    responseManager.TemplateOfResponse(
        {"msg": global.defineManager.MESSAGE_SUCCESS},
        global.defineManager.HTTP_SUCCESS, response)
}

exports.AddRoutineAsMyFavorite = function (admin, request, response, responseManager) {
    targetUserRecord = request.userRecordData
    targetRid = request.body.rid

    if(targetRid == null) {
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
            "if you want add routine as your favorite, then you must give us rid", global.defineManager.LOG_LEVEL_WARN)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }

    date = new Date()
    dateTimeSec = date.getTime() / 1000;

    targetFavoritePath = global.defineManager.DATABASE_ROUTINE_PATH + "/" + targetRid + global.defineManager.DATABASE_ROUTINE_FAVORITE_PATH
    targetFavoriteUserPath = global.defineManager.DATABASE_ROUTINE_PATH + "/" + targetRid + global.defineManager.DATABASE_ROUTINE_FAVORITE_USER_PATH
    targetFavoriteMyHistoryPath = global.defineManager.DATABASE_USERS_PATH + "/" + targetUserRecord.uid + global.defineManager.DATABASE_USERS_FAVORITE_ROUTINE_PATH

    global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
        "increase favorite path: " + targetFavoritePath,
        global.defineManager.LOG_LEVEL_DEBUG)

    favoriteRef = admin.database().ref(targetFavoritePath)
    favoriteRef.transaction(function (favorite) {
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
            "previous favorite: " + favorite,
            global.defineManager.LOG_LEVEL_DEBUG)
        return (favorite || 0) + 1
    })

    global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
        "increase favorite user path: " + targetFavoriteUserPath,
        global.defineManager.LOG_LEVEL_DEBUG)

    favoriteUserRef = admin.database().ref(targetFavoriteUserPath)
    favoriteUserRef.transaction(function (favoriteUser) {
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
            "previous favorite user: " + favoriteUser,
            global.defineManager.LOG_LEVEL_DEBUG)
        if(favoriteUser == null) {
            favoriteUser = []
        }
        favoriteUser.push(targetUserRecord.uid)
        return favoriteUser
    })

    favoriteMyHistoryRef = admin.database().ref(targetFavoriteMyHistoryPath)
    favoriteMyHistoryRef.transaction(function (favoriteRoutine) {
        global.logManager.PrintLogMessage("RoutineManager", "AddRoutineAsMyFavorite",
            "previous favorite history: " + favoriteRoutine,
            global.defineManager.LOG_LEVEL_DEBUG)

        if(favoriteRoutine == null) {
            favoriteRoutine = []
        }
        pushData = {
            "rid": targetRid,
            "uploadDateTimeSec": dateTimeSec
        }
        favoriteRoutine.push(pushData)
        return favoriteRoutine
    })

    responseManager.TemplateOfResponse(
        {"msg": global.defineManager.MESSAGE_SUCCESS},
        global.defineManager.HTTP_SUCCESS, response)
}