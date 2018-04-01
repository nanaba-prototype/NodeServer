function AuthManager() {
    PrintLogMessage("AuthManager", "AuthManager", "init", LOG_LEVEL_INFO)
}

AuthManager.prototype.SignIn = function (signInForm) {
    signInData = GetFormData(signInForm)
    PrintLogMessage("AuthManager", "SignIn", "trying sign in dataSet: " + signInData["email"], LOG_LEVEL_INFO)
}

AuthManager.prototype.SignInSuccess = function () {

}

AuthManager.prototype.SignInFail = function () {

}