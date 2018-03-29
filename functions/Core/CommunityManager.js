exports.IncreaseRoutineGoodPoint = function (admin, response, responseManager, bodyData) {
    global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
        "increase routine good point uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {
            databaseRoutineGoodPointUrl = '/Routine/' + bodyData["rid"] + "/good/"
            admin.database().ref(databaseRoutineGoodPointUrl).once('value', function (snapshot) {
                goodPoint = snapshot.val()
                global.logManager.PrintLogMessage("CommunityManager", "IncreaseRoutineGoodPoint",
                    "current good point is: " + goodPoint,
                    global.defineManager.LOG_LEVEL_INFO)
                goodPoint = goodPoint + 1
                status = admin.database().ref(databaseRoutineGoodPointUrl).set(goodPoint);

                tempResponse = {'msg': global.defineManager.MESSAGE_SUCCESS}
                responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
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