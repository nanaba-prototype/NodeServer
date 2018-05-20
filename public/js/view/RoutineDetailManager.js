function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function PushStepData(indexOfStepData) {
    stepCloneObj = $("#templateOfStep").clone()
    stepCloneObj.removeAttr("hidden")
    stepCloneObj.appendTo("#listOfSteps")

    stackPoint = routineStepStack.length + 1

    stepCloneObj.find("#frequencyDaily").attr("name", "frequency" + stackPoint)
    stepCloneObj.find("#frequencyDaily").attr("id", "frequencyDaily" + stackPoint)
    stepCloneObj.find("#frequencyDailyLabel").attr("for", "frequencyDaily" + stackPoint)

    stepCloneObj.find("#frequencyWeekly").attr("name", "frequency" + stackPoint)
    stepCloneObj.find("#frequencyWeekly").attr("id", "frequencyWeekly" + stackPoint)
    stepCloneObj.find("#frequencyWeeklyLabel").attr("for", "frequencyWeekly" + stackPoint)

    stepCloneObj.find("#frequencyMonthly").attr("name", "frequency" + stackPoint)
    stepCloneObj.find("#frequencyMonthly").attr("id", "frequencyMonthly" + stackPoint)
    stepCloneObj.find("#frequencyMonthlyLabel").attr("for", "frequencyMonthly" + stackPoint)

    stepCloneObj.find("#frequencyAsNeeded").attr("name", "frequency" + stackPoint)
    stepCloneObj.find("#frequencyAsNeeded").attr("id", "frequencyAsNeeded" + stackPoint)
    stepCloneObj.find("#frequencyAsNeededLabel").attr("for", "frequencyAsNeeded" + stackPoint)

    routineStepStack.push(stepCloneObj)
}

function PopStepData() {
    stackPoint = routineStepStack.length - 1
    if(stackPoint < 0) {
        return false
    }
    lastStepObj = routineStepStack[stackPoint]
    lastStepObj.remove()
    routineStepStack.pop()
    return true
}

function ResetSteps() {
    while(PopStepData()) {

    }
}

function SearchRoutineDetailData() {
    targetRid = $("#rid").val()
    routineManager.GetRoutineDetailInfo(targetRid)
}

function SetRoutineBasicInfo(routineDetailData) {
    $("#uploadDate").val(routineDetailData["uploadDate"])
    $("#userName").val(routineDetailData["writer"])
    $("#basicRating").val()
    $("#good").val(routineDetailData["good"])
    $("#favorite").val(routineDetailData["favorite"])
    $("#routineName").val(routineDetailData["title"])
    $("#routineDes").val(routineDetailData["description"])

    $("#morning").prop('checked', false);
    $("#night").prop('checked', false);
    for(index in routineDetailData["time"]) {
        if(routineDetailData["time"][index] == "AM") {
            $("#morning").prop('checked', true);
        }
        else if(routineDetailData["time"][index] == "PM") {
            $("#night").prop('checked', true);
        }
    }

    $("#warm").prop('checked', false);
    $("#cold").prop('checked', false);
    for(index in routineDetailData["season"]) {
        if(routineDetailData["season"][index] == "Warm") {
            $("#warm").prop('checked', true);
        }
        else if(routineDetailData["season"][index] == "Cold") {
            $("#cold").prop('checked', true);
        }
    }

    $("#useRoutineYes").prop('checked', false);
    $("#useRoutineNo").prop('checked', false);
    $("#useRoutineAsNeeded").prop('checked', false);
    if(routineDetailData["areYouUseThis"] == "Yes") {
        $("#useRoutineYes").prop('checked', true);
    }
    else if(routineDetailData["areYouUseThis"] == "No") {
        $("#useRoutineNo").prop('checked', true);
    }
    else if(routineDetailData["areYouUseThis"] == "As Needed") {
        $("#useRoutineAsNeeded").prop('checked', true);
    }
}

function SetRoutineTopCommentInfo() {

}