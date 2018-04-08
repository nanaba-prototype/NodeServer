function RoutineManager(authManager) {
    PrintLogMessage("RoutineManager", "RoutineManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()
    this.authManager = authManager
}

RoutineManager.prototype.SearchRoutine = function (searchOptions) {
    PrintLogMessage("RoutineManager", "SearchRoutine", "search routines based on options", LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "searchRoutine",
        searchOptions,
        this.SearchRoutineSuccess,
        this.SearchRoutineFail,
        this.authManager.GetMyToken()
    )
}

RoutineManager.prototype.SearchRoutineSuccess = function (data) {
    PrintLogMessage("RoutineManager", "SearchRoutineSuccess", "search routines based on options", LOG_LEVEL_INFO)
    resultText = JSON.stringify(data["data"])
    SetServerRequestResult(resultText)
}

RoutineManager.prototype.SearchRoutineFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "SearchRoutineFail", "search routines based on options", LOG_LEVEL_INFO)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}