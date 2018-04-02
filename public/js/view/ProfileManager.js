function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function SetUserInfo(receivedData) {
    $("#userName").text(receivedData["displayName"])
    $("#sex").text(receivedData["sex"])

    date = new Date()
    age = date.getFullYear() - receivedData["birthYear"]

    $("#age").text(age)

    $("#ethnicity").text(receivedData["ethnicity"])
    $("#location").text(receivedData["location"])

    routineNum = receivedData["myRoutine"].length
    $("#routineNum").text("Number of routine (" + routineNum + " Routine)")

    $("#makeupDays").text(receivedData["makeUpDays"] + " days wearing makeup (in a week)")
    $("#avgSleepTime").text(receivedData["sleepTimeAvg"] + " hours of sleep (average)")

    if(typeof receivedData["skinConcern"] == "string") {
        AppendItem("templateOfSkinConcern", "sectionOfSkinConcern", "skinConcern" + receivedData["skinConcern"], receivedData["skinConcern"])
    }
    else {
        for(indexNumber in receivedData["skinConcern"]) {
            AppendItem("templateOfSkinConcern", "sectionOfSkinConcern", "skinConcern" + receivedData["skinConcern"][indexNumber], receivedData["skinConcern"][indexNumber])
        }
    }

    if(typeof receivedData["skinType"] == "string") {
        AppendItem("templateOfSkinType", "sectionOfSkinType", "skinType" + receivedData["skinType"], receivedData["skinType"])
    }
    else {
        for(indexNumber in receivedData["skinType"]) {
            AppendItem("templateOfSkinType", "sectionOfSkinType", "skinType" + receivedData["skinType"][indexNumber], receivedData["skinType"][indexNumber])
        }
    }

    $("#allergy").text(receivedData["allergy"])
}

function AppendItem(targetObjId, appendToId, id, content) {
    cloneObj = $("#" + targetObjId).clone()
    cloneObj.removeAttr("hidden")
    cloneObj.attr("id", id)
    cloneObj.find("a").text(content)
    cloneObj.appendTo("#" + appendToId)
}