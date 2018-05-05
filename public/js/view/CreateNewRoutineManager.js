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
    if(routineStepNum > 1) {
        routineStepNum -= 1
    }
    PrintLogMessage("CreateNewRoutineManager", "DecreaseRoutineNum", "now routine num: " + routineStepNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineStepNum)

    PopRoutineStep()
}

function IncreaseRoutineNum() {
    if(routineStepNum < 13) {
        routineStepNum += 1
    }
    PrintLogMessage("CreateNewRoutineManager", "IncreaseRoutineNum", "now routine num: " + routineStepNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineStepNum)

    PushRoutineStep()
}

function PushRoutineStep() {
    stackPoint = routineStepStack.length

    cloneStepObj = $("#templateOfStep").clone()
    cloneStepObj.removeAttr("hidden")
    cloneStepObj.attr("id", "step" + stackPoint)
    cloneStepObj.appendTo("#listOfSteps")

    routineStepStack.push(cloneStepObj)
}

function PopRoutineStep() {
    lastStepObj = routineStepStack[routineStepStack.length - 1]
    lastStepObj.remove()
    routineStepStack.pop()
    return true
}

function ResetRoutineStep() {
    while(PopRoutineStep()){

    }
}

PushRoutineStep()