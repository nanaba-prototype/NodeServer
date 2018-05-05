function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

$().ready(function () {
    $("#decreaseRoutine").click(function () {
        PrintLogMessage("CreateNewRoutineManager", "ready", "clicked decrease routine", LOG_LEVEL_DEBUG)
        DecreaseRoutineNum()
    })
    $("#increaseRoutine").click(function () {
        PrintLogMessage("CreateNewRoutineManager", "ready", "clicked increase routine", LOG_LEVEL_DEBUG)
        IncreaseRoutineNum()
    })
})

function DecreaseRoutineNum() {
    if(routineNum > 1) {
        routineNum -= 1
    }
    PrintLogMessage("CreateNewRoutineManager", "DecreaseRoutineNum", "now routine num: " + routineNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineNum)
}

function IncreaseRoutineNum() {
    if(routineNum < 13) {
        routineNum += 1
    }
    PrintLogMessage("CreateNewRoutineManager", "IncreaseRoutineNum", "now routine num: " + routineNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineNum)
}