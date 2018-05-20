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
    SetServerRequestResult(resultText)
}

RoutineManager.prototype.GetRoutineHistoryRidList = function () {
    targetUid = this.authManager.GetCurrentUser().uid
    limit = 5
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidList", "get my routine history uid: " + targetUid + " limit: " + limit, LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "getRoutineHistoryAsRid",
        {"uid": targetUid, "limit": limit},
        this.GetRoutineHistoryRidListSuccess,
        this.GetRoutineHistoryRidListFail,
        this.authManager.GetMyToken()
    )
}

RoutineManager.prototype.GetRoutineHistoryRidListSuccess = function (data) {
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidListSuccess", "create routine success", LOG_LEVEL_INFO)
    resultText = JSON.stringify(data["data"])
    SetServerRequestResult(resultText)

    for(indexOfRoutine in data["data"]) {
        rid = data["data"][indexOfRoutine]["rid"]
        routineManager.GetRoutineHistoryRidToInfo(rid)
    }
}

RoutineManager.prototype.GetRoutineHistoryRidListFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidListFail", "get rid list failed: " + errorText, LOG_LEVEL_WARN)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}

RoutineManager.prototype.GetRoutineHistoryRidToInfo = function (rid) {
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidToInfo", "get routine info rid: " + rid, LOG_LEVEL_INFO)
    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "getRoutineHistoryInfo",
        {"rid": rid},
        this.GetRoutineHistoryRidToInfoSuccess,
        this.GetRoutineHistoryRidToInfoFail,
        this.authManager.GetMyToken()
    )
}

RoutineManager.prototype.GetRoutineHistoryRidToInfoSuccess = function (data) {
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidToInfoSuccess", "get routine info based on rid successfully", LOG_LEVEL_INFO)
    resultText = JSON.stringify(data["data"])
    SetServerRequestResult(resultText)

    url = "routine-detail.html?rid=" + data["data"]["rid"]
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidToInfoSuccess", "link url: " + url, LOG_LEVEL_DEBUG)

    PushRoutineInfoRow(resultText, url, data["data"]["rid"])
}

RoutineManager.prototype.GetRoutineHistoryRidToInfoFail = function (errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "GetRoutineHistoryRidToInfoFail", "get routine info based on rid failed: " + errorText, LOG_LEVEL_WARN)
    SetServerRequestResult(SERVER_RESULT_FAILED)
}

RoutineManager.prototype.GetRoutineDetailInfo = function(targetRid) {
    PrintLogMessage("RoutineManager", "GetRoutineDetailInfo", "search routine detail info: " + targetRid,
        LOG_LEVEL_INFO)

    this.dataTransferManager.GetRequestWithCallbackFunc(
        DOMAIN + SUB_DIRECTORY + "getRoutineDetailInfo",
        {"rid": targetRid},
        this.GetRoutineDetailInfoSuccess,
        this.GetRoutineDetailInfoFail,
        this.authManager.GetMyToken()
    )
}

RoutineManager.prototype.GetRoutineDetailInfoSuccess = function(data) {
    PrintLogMessage("RoutineManager", "GetRoutineDetailInfoSuccess", "routine detail info received successfully",
        LOG_LEVEL_INFO)

    routineDetailData = data["data"]

    stepList = routineDetailData["steps"]
    for(index in stepList) {
        PushStepData(stepList[index])
    }
    SetRoutineBasicInfo(routineDetailData)

    SetServerRequestResult(JSON.stringify(data))
}

RoutineManager.prototype.GetRoutineDetailInfoFail = function(errorText, errorStatus) {
    PrintLogMessage("RoutineManager", "GetRoutineDetailInfoFail", "something wrong with getting routine detail info",
        LOG_LEVEL_WARN)
}