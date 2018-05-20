function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function PushRoutineInfoRow(infoText, detailBtnUrl, rid) {
    routineInfoStackPoint = routineHistoryStack.length

    routineInfoObj = $("#templateOfRoutineRow").clone()
    routineInfoObj.removeAttr("hidden")
    routineInfoObj.appendTo("#bodyOfTable")
    routineInfoObj.attr("id", "routineInfo" + routineInfoStackPoint)

    infoTextObj = routineInfoObj.find("#routineInfo")
    infoTextObj.text(infoText)

    detailBtnObj = routineInfoObj.find("#detailBtn")
    detailBtnObj.attr("data-url", detailBtnUrl)
    detailBtnObj.attr("data-rid", rid)

    $(detailBtnObj).click(function () {
        routineDetailUrl = $(this).attr("data-url")
        routineUniqueId = $(this).attr("data-rid")
        PrintLogMessage("MyRoutineHistoryManager", "detailBtnUrlClicked", "linked url: " + routineDetailUrl, LOG_LEVEL_DEBUG)
        testLabManager.SaveTempData(routineUniqueId)
        testLabManager.LoadAnotherPage(routineDetailUrl, "Show detail of routine (Auth)")
    })

    routineHistoryStack.push(routineInfoObj)
}

function PopRoutineInfoRow() {
    if(routineHistoryStack.length <= 0) {
        return false
    }
    stackPoint = routineHistoryStack.length - 1
    $(routineHistoryStack[stackPoint]).remove()
    routineHistoryStack.pop()
    return true
}

function ResetRoutineInfoRow() {
    while(PopRoutineInfoRow()) {

    }
}

$().ready(function () {

    ResetRoutineInfoRow()
    routineManager = new RoutineManager(authManager)
    routineManager.GetRoutineHistoryRidList()
})

function SetRoutineList(routineDataList) {

}