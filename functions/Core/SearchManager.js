exports.SearchRoutines = function (admin, request, response, responseManager) {
    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "search routines with options: " + JSON.stringify(request.body), global.defineManager.LOG_LEVEL_DEBUG)

    

    responseManager.TemplateOfResponse(
        {"msg": global.defineManager.MESSAGE_SUCCESS},
        global.defineManager.HTTP_SUCCESS, response)
}