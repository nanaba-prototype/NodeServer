function AuthManager() {
    PrintLogMessage("AuthManager", "AuthManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()
}

AuthManager.prototype.SignIn = function (signInForm) {
    signInData = GetFormData(signInForm)
    PrintLogMessage("AuthManager", "SignIn", "trying sign in dataSet: " + signInData["email"], LOG_LEVEL_INFO)

    firebase.auth().signInWithEmailAndPassword(signInData["email"], signInData["password"])
        .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        PrintLogMessage("AuthManager", "SignIn", "sign in error: " + errorCode + " -> " + errorMessage, LOG_LEVEL_ERROR)
        // ...
    });
}

AuthManager.prototype.SignOut = function () {
    PrintLogMessage("AuthManager", "SignOut", "try to sign out", LOG_LEVEL_INFO)
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        PrintLogMessage("AuthManager", "SignOut", "sign out successfully", LOG_LEVEL_INFO)
    }).catch(function(error) {
        // An error happened.
        PrintLogMessage("AuthManager", "SignOut", "sign out failed: " + error, LOG_LEVEL_ERROR)
    });
}

AuthManager.prototype.SignUp = function (signUpFormData) {
    PrintLogMessage("AuthManager", "SignUp", "trying sign up", LOG_LEVEL_INFO)
    this.dataTransferManager.PostRequestWithCallbackFunc(
        DOMAIN + "signUp",
        signUpFormData,
        this.SignUpSuccess,
        this.SignUpFail
    )
}

AuthManager.prototype.SignUpSuccess = function (data) {
    PrintLogMessage("AuthManager", "SignUpSuccess", "sign up successfully", LOG_LEVEL_INFO)
}

AuthManager.prototype.SignUpFail = function (errorText, errorStatus) {
    PrintLogMessage("AuthManager", "SignUpFail", "failed to sign up", LOG_LEVEL_INFO)
}

AuthManager.prototype.SignInSuccess = function () {

}

AuthManager.prototype.SignInFail = function () {

}

AuthManager.prototype.GetSignedInUser = function () {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            PrintLogMessage("AuthManager", "SignIn", "already signed in user " + user.displayName + " uid: " + user.uid, LOG_LEVEL_INFO)
            SetSignInInfo(user.displayName, user.uid)
        } else {
            // No user is signed in.
            PrintLogMessage("AuthManager", "SignIn", "no one has signed in", LOG_LEVEL_WARN)
            SetSignInInfo("Not signed in", "")
        }
    });
}