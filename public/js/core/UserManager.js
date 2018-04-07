function UserManager(authManager) {
    this.authManager = authManager
    this.dataTransferManager = new DataTransferManager(this.authManager.GetMyToken())
}

UserManager.prototype.GetUserInfo = function () {
    currentUser = firebase.auth().currentUser
    if(currentUser) {
        currentUserUid = currentUser.uid
        PrintLogMessage("UserManager", "GetUserInfo", "request get user info uid: " + currentUserUid, LOG_LEVEL_INFO)
        this.dataTransferManager.GetRequestWithCallbackFunc(
            DOMAIN + "app/getUserInfoAuth",
            {},
            this.GetUserInfoSuccess,
            this.GetUserInfoFail,
            this.authManager.GetMyToken()
        )
    }
    else {
        PrintLogMessage("UserManager", "GetUserInfo", "plz sign in first", LOG_LEVEL_WARN)
    }
}

UserManager.prototype.GetUserInfoSuccess = function (data) {
    resultText = JSON.stringify(data)
    data = JSON.parse(data)
    PrintLogMessage("UserManager", "GetUserInfoSuccess", "getting user info successfully", LOG_LEVEL_INFO)
    SetServerRequestResult(resultText)
    SetUserInfo(data["data"])
}

UserManager.prototype.GetUserInfoFail = function (errorText, errorStatus) {
    PrintLogMessage("UserManager", "GetUserInfoFail", "something has problem", LOG_LEVEL_WARN)
    SetServerRequestResult("Something crashed. Shit!")
}