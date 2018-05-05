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
    ShowSearchedRoutineData(data["data"])
}

RoutineManager.prototype.SearchRoutineFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "SearchRoutineFail", "search routines based on options", LOG_LEVEL_WARN)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}

RoutineManager.prototype.CreateNewRoutine = function () {
    PrintLogMessage("RoutineManager", "CreateNewRoutine", "upload user wrote routine data", LOG_LEVEL_INFO)
    routineInfoData = GetRoutineInfo()
    PrintLogMessage("RoutineManager", "CreateNewRoutine", "collected routine data: " + JSON.stringify(routineInfoData), LOG_LEVEL_INFO)
    this.dataTransferManager.PostRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "createRoutine",
        routineInfoData,
        this.CreateNewRoutineSuccess,
        this.CreateNewRoutineFail,
        this.authManager.GetMyToken()
    )

}

RoutineManager.prototype.CreateNewRoutineSuccess = function (data) {
    PrintLogMessage("RoutineManager", "CreateNewRoutineSuccess", "create routine success", LOG_LEVEL_INFO)
    resultText = JSON.stringify(data["data"])
    SetServerRequestResult(resultText)
}

RoutineManager.prototype.CreateNewRoutineFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "CreateNewRoutineFail", "create new routine failed: " + errorText, LOG_LEVEL_INFO)
}