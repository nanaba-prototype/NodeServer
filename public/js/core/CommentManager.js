function CommentManager() {
    PrintLogMessage("CommentManager", "CommentManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()
    this.authManager = authManager
}

CommentManager.prototype.AddNewComment = function(rid, commentMsg){
    PrintLogMessage("CommentManager", "AddNewComment", "upload new comment msg: " + commentMsg + " to: " + rid, LOG_LEVEL_DEBUG)
    this.dataTransferManager.PostRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "addNewComment",
        {
            "rid": rid,
            "body": commentMsg
        },
        this.AddNewCommentSuccess,
        this.AddNewCommentFail,
        this.authManager.GetMyToken()
    )
}

CommentManager.prototype.AddNewCommentSuccess = function (data) {
    PrintLogMessage("CommentManager", "AddNewComment", "add new comment successfully", LOG_LEVEL_INFO)
    SetServerRequestResult(JSON.stringify(data))
}

CommentManager.prototype.AddNewCommentFail = function (errorText, errorStatus) {
    PrintLogMessage("CommentManager", "AddNewComment", "something wrong with add new comment: " + errorText, LOG_LEVEL_WARN)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}

CommentManager.prototype.SearchCommentList = function (rid) {
    PrintLogMessage("CommentManager", "SearchCommentList", "search comment list rid: " + rid, LOG_LEVEL_INFO)
}

CommentManager.prototype.SearchCommentListSuccess = function (data) {
    PrintLogMessage("CommentManager", "SearchCommentList", "search comment successfully", LOG_LEVEL_INFO)
    SetServerRequestResult(JSON.stringify(data))
}

CommentManager.prototype.SearchCommentListFail = function (errorText, errorStatus) {
    PrintLogMessage("CommentManager", "SearchCommentList", "something wrong with searching comment list: " + errorText, LOG_LEVEL_INFO)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}