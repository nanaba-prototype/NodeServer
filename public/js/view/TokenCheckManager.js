function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}
function SetSignInInfo(displayName, uid) {
    $("#displayName").text("Display name: " + displayName)
    $("#uid").text("UID: " + uid)
}
function SetTokenVal(tokenVal) {
    $("#token").val(tokenVal)
}