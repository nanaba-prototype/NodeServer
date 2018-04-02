function UserManager() {
    this.dataTransferManager = new DataTransferManager()
}

UserManager.prototype.GetUserInfo = function () {
    currentUser = firebase.auth().currentUser
    if(currentUser) {
        currentUserUid = currentUser.uid
        PrintLogMessage("UserManager", "GetUserInfo", "request get user info uid: " + currentUserUid, LOG_LEVEL_INFO)
        this.dataTransferManager.GetRequestWithCallbackFunc(
            DOMAIN + "getUserInfoAuth",
            {"uid": currentUserUid},
            this.GetUserInfoSuccess,
            this.GetUserInfoFail
        )
    }
    else {
        PrintLogMessage("UserManager", "GetUserInfo", "plz sign in first", LOG_LEVEL_WARN)
    }
}

UserManager.prototype.GetUserInfoSuccess = function (data) {
    resultText = JSON.stringify(data)
    PrintLogMessage("UserManager", "GetUserInfoSuccess", "getting user info successfully", LOG_LEVEL_INFO)
    SetServerRequestResult(resultText)
}

UserManager.prototype.GetUserInfoFail = function (errorText, errorStatus) {
    PrintLogMessage("UserManager", "GetUserInfoFail", "something has problem", LOG_LEVEL_WARN)
    SetServerRequestResult("Something crashed. Shit!")
}