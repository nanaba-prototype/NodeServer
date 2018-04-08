function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}
function SetSignInInfo(displayName, uid) {
    $("#displayName").text("Display name: " + displayName)
    $("#uid").text("UID: " + uid)
}

function SetTokenVal(authManager) {
    $("#token").val(authManager.GetMyToken())
}

function PushTableRow() {
    id = "row" + routineTableArray.length
    rowTemplate = $("#templateOfRoutineSearchRow").clone()
    rowTemplate.removeAttr("hidden")
    rowTemplate.appendTo("#bodyOfTable")
    rowTemplate.attr("id", id)
    routineTableArray.push(rowTemplate)
    PrintLogMessage("SearchRoutineManager", "PushTableRow", "added new table row", LOG_LEVEL_DEBUG)
}

function PopTableRow() {
    stackPoint = routineTableArray.length - 1
    if(stackPoint < 0) {
        PrintLogMessage("SearchRoutineManager", "PushTableRow", "no item to pop", LOG_LEVEL_WARN)
        return false
    }
    routineTableArray[stackPoint].remove()
    routineTableArray.pop()
    PrintLogMessage("SearchRoutineManager", "PopTableRow", "item popped len: " + stackPoint, LOG_LEVEL_DEBUG)
    return true
}

function ResetTableRow() {
    while(PopTableRow()) {

    }
    routineTableArray = []
    PrintLogMessage("SearchRoutineManager", "ResetTableRow", "table row resetted", LOG_LEVEL_DEBUG)
}

routineTableArray = []