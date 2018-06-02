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
    PrintLogMessage("CommentManager", "AddNewComment", "add new comment successfully", LOG_LEVEL_DEBUG)
    SetServerRequestResult(JSON.stringify(data))
}

CommentManager.prototype.AddNewCommentFail = function (errorText, errorStatus) {
    PrintLogMessage("CommentManager", "AddNewComment", "something wrong with add new comment: " + errorText, LOG_LEVEL_DEBUG)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}