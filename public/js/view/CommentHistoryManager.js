function SetServerRequestResult(resultData) {
    $("#serverResult").text(resultData)
}

function PushCommentItem() {
    
}

function PopCommentItem() {
    
}

function ResetCommentTable() {
    
}

function SearchTargetRoutineComment() {
    
}

$().ready(function () {
    // console.log("url : "+$(location).attr('protocol')+"//"+$(location).attr('host')+""+$(location).attr('pathname')+""+$(location).attr('search'));
    $("#rid").val(testLabManager.LoadTempData())
})
