function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function PushCommentItem(commentData) {
    commentObj = $("#templateOfCommentRow").clone()
    commentObj.removeAttr("hidden")
    commentObj.appendTo("#bodyOfTable")

    commentDataColObj = commentObj.find("#commentInfo")
    commentDataColObj.text(commentData)

    commentHistoryStack.push(commentObj)
}

function PopCommentItem() {
    commentStackPoint = commentHistoryStack.length - 1
    if(commentStackPoint < 0) {
        return false
    }

    commentObj = commentHistoryStack[commentStackPoint]
    commentObj.remove()
    commentHistoryStack.pop()
    return true
}

function ResetCommentTable() {
    while(PopCommentItem()) {

    }
}

function SearchTargetRoutineComment() {
    targetRid = $("#rid").val()
    commentManager.SearchCommentList(targetRid)
}

function UpdateCommentList(commentListData) {

}

$().ready(function () {
    // console.log("url : "+$(location).attr('protocol')+"//"+$(location).attr('host')+""+$(location).attr('pathname')+""+$(location).attr('search'));
    $("#rid").val(testLabManager.LoadTempData())
})
