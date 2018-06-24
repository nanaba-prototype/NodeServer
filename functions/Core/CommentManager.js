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
    bodyData = request.body
    userRecordData = request.userRecordData

    targetRid = bodyData["rid"]
    commentBody = bodyData["body"]
    replyFor = bodyData["replyFor"]

    if(targetRid == null || commentBody == null) {
        global.logManager.PrintLogMessage("CommentManager", "AddNewComment", "you must include rid and comment body data",
            global.defineManager.LOG_LEVEL_WARN)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }

    global.logManager.PrintLogMessage("CommentManager", "AddNewComment", "add comment to rid: " + targetRid,
        global.defineManager.LOG_LEVEL_INFO)

    date = global.dateTimeManager.GetCurrentDate()
    dateStr = global.dateTimeManager.GetCurrentDateStr(date)
    dateSec = global.dateTimeManager.GetCurrentDateSec(date)

    cidData = {
        "body": commentBody,
        "date": dateStr,
        "positive": 0,
        "uid": userRecordData["uid"],
        "replyFor": replyFor || null,
        "commentator": userRecordData['displayName'],
        "dateSec": dateSec
    }

    path = global.defineManager.DATABASE_ROUTINE_PATH + "/" + targetRid + "/commentUser/"
    admin.database().ref(path).push().set(cidData);

    global.logManager.PrintLogMessage("CommentManager", "AddNewComment", "comment saved",
        global.defineManager.LOG_LEVEL_INFO)

    responseManager.TemplateOfResponse(
        {"msg": global.defineManager.MESSAGE_SUCCESS},
        global.defineManager.HTTP_SUCCESS, response)
}

exports.GetListOfComments = function (admin, request, response, responseManager) {

    targetRid = request.query.rid
    showLimit = Number(request.query.limit) || global.defineManager.QUERY_RETURN_LIMIT

    if(targetRid == null) {
        global.logManager.PrintLogMessage("CommentManager", "GetListOfComments",
            "you should send target rid",
            global.defineManager.LOG_LEVEL_WARN)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }

    global.logManager.PrintLogMessage("CommentManager", "GetListOfComments",
        "getting list of comments: " + targetRid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref(global.defineManager.DATABASE_ROUTINE_PATH + "/" + targetRid
        + global.defineManager.DATABASE_COMMENT_PATH + "/").orderByChild("dateSec")
        .limitToLast(showLimit).on("value", function (snapshot) {
        snapshotStr = JSON.stringify(snapshot)
        global.logManager.PrintLogMessage("CommentManager", "GetListOfComments",
            "comments list string: " + snapshotStr,
            global.defineManager.LOG_LEVEL_DEBUG)

        responseManager.TemplateOfResponse(snapshot, global.defineManager.HTTP_SUCCESS, response)
    })
}

exports.IncreaseCommentScore = function (admin, request, response, responseManager) {

    targetCid = request.body.cid
    targetRid = request.body.rid

    if(targetCid == null) {
        global.logManager.PrintLogMessage("CommentManager", "IncreaseCommentScore",
            "increase comment score rid: " + targetRid + "cid: " + targetCid, global.defineManager.LOG_LEVEL_DEBUG)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }

    targetCommentPath = global.defineManager.DATABASE_ROUTINE_PATH
        + global.defineManager.DATABASE_COMMENT_PATH + "/" + targetCid + global.defineManager.DATABASE_COMMENT_POSITIVE_PATH

    global.logManager.PrintLogMessage("CommentManager", "IncreaseCommentScore",
        "target positive path: " + targetCommentPath, global.defineManager.LOG_LEVEL_DEBUG)

    commentRef = admin.database().ref(targetCommentPath)
    commentRef.transaction(function (positive) {
        global.logManager.PrintLogMessage("CommentManager", "IncreaseCommentScore",
            "previous comment score: " + positive, global.defineManager.LOG_LEVEL_DEBUG)
        return (positive || 0) + 1
    })

    responseManager.TemplateOfResponse(
        {"msg": global.defineManager.MESSAGE_SUCCESS},
        global.defineManager.HTTP_SUCCESS, response)
}