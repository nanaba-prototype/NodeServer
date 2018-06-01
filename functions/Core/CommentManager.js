exports.addComment = function (admin, response, responseManager, generateManager, bodyData) {
    global.logManager.PrintLogMessage("CommentManager", "addComment",
        "add new comment to target routine uid: " + bodyData.uid + " rid: " + bodyData.rid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.auth().getUser(bodyData["uid"])
        .then(function (userRecord) {
            userRecordData = userRecord.toJSON()

            dateStr = new Date().toISOString()
            cid = generateManager.CreateHash(bodyData.uid + bodyData.rid + dateStr)

            cidData = {
                "body": bodyData["body"],
                "date": dateStr,
                "positive": 0,
                "uid": bodyData["uid"],
                "replyFor": bodyData["replyFor"] || null
            }

            path = '/Routine/' + bodyData.rid + "/commentUser/" + cid + "/"
            global.logManager.PrintLogMessage("CommentManager", "addComment",
                "comment add path: " + path,
                global.defineManager.LOG_LEVEL_DEBUG)

            status = admin.database().ref(path).set(cidData);

            global.logManager.PrintLogMessage("CommentManager", "addComment",
                "comment added cid: " + cid,
                global.defineManager.LOG_LEVEL_INFO)
            tempResponse = {'cid': cid}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_SUCCESS, response)
        })
        .catch(function (error) {

            global.logManager.PrintLogMessage("CommentManager", "addComment",
                "there is something problem msg: " + error.message,
                global.defineManager.LOG_LEVEL_ERROR)
            tempResponse = {'cid': global.defineManager.NOT_AVAILABLE}

            responseManager.TemplateOfResponse(tempResponse, global.defineManager.HTTP_REQUEST_ERROR, response)
        })
}

exports.AddNewComment = function (admin, request, response, responseManager) {

}