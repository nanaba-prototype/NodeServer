function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function PushRoutineInfoRow(infoText, detailBtnUrl) {
    routineInfoStackPoint = routineHistoryStack.length

    routineInfoObj = $("#templateOfRoutineRow").clone()
    routineInfoObj.removeAttr("hidden")
    routineInfoObj.appendTo("#bodyOfTable")
    routineInfoObj.attr("id", "routineInfo" + routineInfoStackPoint)

    infoTextObj = routineInfoObj.find("#routineInfo")
    infoTextObj.text(infoText)

    detailBtnObj = routineInfoObj.find("#detailBtn")
    detailBtnObj.attr("data-url", detailBtnUrl)

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