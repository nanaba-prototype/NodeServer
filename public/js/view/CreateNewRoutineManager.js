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
    $("#uploadMyRoutine").click(function () {
        PrintLogMessage("CreateNewRoutineManager", "ready", "clicked upload routine", LOG_LEVEL_DEBUG)
        GetStepInfo()
    })
})

function DecreaseRoutineNum() {
    if(routineStepNum > 1) {
        routineStepNum -= 1

        PopRoutineStep()
    }
    PrintLogMessage("CreateNewRoutineManager", "DecreaseRoutineNum", "now routine num: " + routineStepNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineStepNum)
}

function IncreaseRoutineNum() {
    if(routineStepNum < 13) {
        routineStepNum += 1

        PushRoutineStep()
    }
    PrintLogMessage("CreateNewRoutineManager", "IncreaseRoutineNum", "now routine num: " + routineStepNum, LOG_LEVEL_DEBUG)
    $("#routineNum").text(routineStepNum)
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

function GetStepInfo() {
    listOfStepsData = {}
    stepLength = routineStepStack.length
    checkingCounter = 0
    PrintLogMessage("CreateNewRoutineManager", "GetStepInfo", "getting step data len: " + stepLength, LOG_LEVEL_DEBUG)
    for(checkingCounter = 0; checkingCounter < stepLength; checkingCounter += 1) {
        indexOfStep = routineStepStack[checkingCounter]
        indexOfStepData = {}

        indexOfStepData["name"] = $(indexOfStep).find("#stepName").val()
        indexOfStepData["productBrand"] = $(indexOfStep).find("#productBrand").val()
        indexOfStepData["productName"] = $(indexOfStep).find("#productName").val()

        frequency = []
        frequency.push($(indexOfStep).find("#frequencyDaily").val())
        frequency.push($(indexOfStep).find("#frequencyWeekly").val())
        frequency.push($(indexOfStep).find("#frequencyMonthly").val())
        frequency.push($(indexOfStep).find("#frequencyAsNeeded").val())
        indexOfStepData["frequency"] = frequency

        indexOfStepData["rating"] = $(indexOfStep).find("#rating").val()
        indexOfStepData["tags"] = [$(indexOfStep).find("#tags").val()]
        indexOfStepData["advice"] = $(indexOfStep).find("#advice").val()

        PrintLogMessage("CreateNewRoutineManager", "GetStepInfo", "#" + checkingCounter + " data: " + JSON.stringify(indexOfStepData), LOG_LEVEL_DEBUG)

        listOfStepsData[checkingCounter] = indexOfStepData
    }
    return listOfStepsData
}

PushRoutineStep()