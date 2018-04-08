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

function PushTableRow(rowData) {
    id = "row" + routineTableArray.length
    rowTemplate = $("#templateOfRoutineSearchRow").clone()
    rowTemplate.removeAttr("hidden")
    rowTemplate.appendTo("#bodyOfTable")
    rowTemplate.attr("id", id)

    dataColCounter = 0
    // for(indexOfCol in rowTemplate.children("td")) {
    //     $(rowTemplate.children("td")[indexOfCol]).text(rowData[dataColCounter])
    // }
    for(dataColCounter = 0; dataColCounter < rowTemplate.children("td").length; dataColCounter += 1) {
        $(rowTemplate.children("td")[dataColCounter]).text(rowData[dataColCounter])
    }

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

function ShowSearchedRoutineData(searchedRoutineData) {
    for(key in searchedRoutineData) {
        indexOfRoutineData = searchedRoutineData[key]
        PushTableRow([
            indexOfRoutineData["routineName"],
            "API NOT SUPPORT",
            indexOfRoutineData["good"],
            indexOfRoutineData["comment"],
            indexOfRoutineData["isMyFavorite"]
        ])
    }
}

routineTableArray = []