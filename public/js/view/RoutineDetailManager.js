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

}

function ResetSteps() {

}

function SearchRoutineDetailData() {

}

function SetRoutineBasicInfo() {

}

function SetRoutineTopCommentInfo() {

}