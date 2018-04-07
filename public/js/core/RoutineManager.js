function RoutineManager() {
    PrintLogMessage("RoutineManager", "RoutineManager", "init", LOG_LEVEL_INFO)
    this.dataTransferManager = new DataTransferManager()
}

RoutineManager.prototype.SearchRoutine = function (searchOptions) {
    PrintLogMessage("RoutineManager", "SearchRoutine", "search routines based on options", LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + "searchRoutine",
        searchOptions,
        this.SearchRoutineSuccess,
        this.SearchRoutineFail
    )
}

RoutineManager.prototype.SearchRoutineSuccess = function (data) {
    PrintLogMessage("RoutineManager", "SearchRoutineSuccess", "search routines based on options", LOG_LEVEL_INFO)
}

RoutineManager.prototype.SearchRoutineFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "SearchRoutineFail", "search routines based on options", LOG_LEVEL_INFO)
}