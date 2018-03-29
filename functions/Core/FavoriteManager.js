exports.AddMyFavoriteRoutine = function (admin, response, responseManager, bodyData) {
    global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
        "increase routine good point uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {
            uidPath = "/Users/" + bodyData["uid"] + "/favoriteRoutine/"
            ridListPath = "/Routine/" + bodyData["rid"] + "/favoriteUser/"
            ridLengthPath = "/Routine/" + bodyData["rid"] + "/favorite/"
            admin.database().ref(uidPath).once('value', function (snapshot) {
                myFavoriteRoutineList = snapshot.val()
                for(indexNumber in myFavoriteRoutineList) {
                    if(myFavoriteRoutineList[indexNumber] == bodyData["rid"]) {//routine already checked my favorite
                        tempResponse = {'msg': global.defineManager.MESSAGE_FAILED}

                        responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
                        global.logManager.PrintLogMessage("FavoriteManager", "AddMyFavoriteRoutine",
                            "this routine is already checked my favorite",
                            global.defineManager.LOG_LEVEL_WARN)
                    }
                }
                admin.database().ref(ridListPath).once('value', function (snapshot) {
                    listOfFavoriteRoutineUser = snapshot.val()
                    if(myFavoriteRoutineList == null) {
                        myFavoriteRoutineList = []
                    }
                    if(listOfFavoriteRoutineUser == null) {
                        listOfFavoriteRoutineUser = []
                    }
                    myFavoriteRoutineList.push(bodyData["rid"])
                    listOfFavoriteRoutineUser.push(bodyData["uid"])
                    lengthOfFavoriteRoutineUser = listOfFavoriteRoutineUser.length

                    status = admin.database().ref(uidPath).set(myFavoriteRoutineList);
                    status = admin.database().ref(ridListPath).set(listOfFavoriteRoutineUser);
                    status = admin.database().ref(ridLengthPath).set(lengthOfFavoriteRoutineUser);

                    tempResponse = {'msg': global.defineManager.MESSAGE_SUCCESS}

                    responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
                    global.logManager.PrintLogMessage("FavoriteManager", "AddMyFavoriteRoutine",
                        "check my favorite routine successfully",
                        global.defineManager.LOG_LEVEL_INFO)
                })
            })
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