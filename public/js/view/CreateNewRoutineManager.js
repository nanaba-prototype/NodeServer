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
        routineManager = new RoutineManager()
        routineManager.CreateNewRoutine()
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

    cloneStepObj.find("#frequencyDaily").attr("name", "frequency" + stackPoint)
    cloneStepObj.find("#frequencyDaily").attr("id", "frequencyDaily" + stackPoint)
    cloneStepObj.find("#frequencyDailyLabel").attr("for", "frequencyDaily" + stackPoint)

    cloneStepObj.find("#frequencyWeekly").attr("name", "frequency" + stackPoint)
    cloneStepObj.find("#frequencyWeekly").attr("id", "frequencyWeekly" + stackPoint)
    cloneStepObj.find("#frequencyWeeklyLabel").attr("for", "frequencyWeekly" + stackPoint)

    cloneStepObj.find("#frequencyMonthly").attr("name", "frequency" + stackPoint)
    cloneStepObj.find("#frequencyMonthly").attr("id", "frequencyMonthly" + stackPoint)
    cloneStepObj.find("#frequencyMonthlyLabel").attr("for", "frequencyMonthly" + stackPoint)

    cloneStepObj.find("#frequencyAsNeeded").attr("name", "frequency" + stackPoint)
    cloneStepObj.find("#frequencyAsNeeded").attr("id", "frequencyAsNeeded" + stackPoint)
    cloneStepObj.find("#frequencyAsNeededLabel").attr("for", "frequencyAsNeeded" + stackPoint)

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
        if($(indexOfStep).find("#frequencyDaily" + checkingCounter).is(':checked')) {
            frequency.push("Daily")
        }
        if($(indexOfStep).find("#frequencyWeekly" + checkingCounter).is(':checked')) {
            frequency.push("Weekly")
        }
        if($(indexOfStep).find("#frequencyMonthly" + checkingCounter).is(':checked')) {
            frequency.push("Monthly")
        }
        if($(indexOfStep).find("#frequencyAsNeeded" + checkingCounter).is(':checked')) {
            frequency.push("As Needed")
        }
        indexOfStepData["frequency"] = frequency

        indexOfStepData["rating"] = $(indexOfStep).find("#rating").val()
        indexOfStepData["tags"] = [$(indexOfStep).find("#tags").val()]
        indexOfStepData["advice"] = $(indexOfStep).find("#advice").val()

        PrintLogMessage("CreateNewRoutineManager", "GetStepInfo", "#" + checkingCounter + " data: " + JSON.stringify(indexOfStepData), LOG_LEVEL_DEBUG)

        listOfStepsData[(checkingCounter + 1)] = indexOfStepData
    }
    return listOfStepsData
}

function GetRoutineInfo() {
    routineInfoData = {}
    routineInfoData["title"] = $("#routineName").val()
    routineInfoData["description"] = $("#routineDes").val()

    morningOrNight = []
    if($("#morning").is(":checked")) {
        morningOrNight.push("AM")
    }
    if($("#night").is(":checked")) {
        morningOrNight.push("PM")
    }
    routineInfoData["time"] = morningOrNight

    seasons = []
    if($("#warm").is(":checked")) {
        seasons.push("Warm")
    }
    if($("#cold").is(":checked")) {
        seasons.push("Cold")
    }
    routineInfoData["season"] = seasons

    routineInfoData["areYouUseThis"] = "No"
    if($("#useRoutineYes").is(":checked")) {
        seasons.push("Yes")
    }
    if($("#useRoutineNo").is(":checked")) {
        seasons.push("No")
    }
    if($("#useRoutineAsNeeded").is(":checked")) {
        seasons.push("AsNeeded")
    }

    listOfStepsData = GetStepInfo()
    routineInfoData["routineLength"] = $("#routineNum").text()
    routineInfoData["steps"] = listOfStepsData

    return routineInfoData

}

PushRoutineStep()