exports.SearchRoutines = function (admin, request, response, responseManager) {
    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "search routines with options: " + JSON.stringify(request.body), global.defineManager.LOG_LEVEL_DEBUG)

    databaseSearchQuery = request.body
    databaseQueryPath = global.defineManager.DATABASE_ROUTINE_PATH + "/"
    searchQueryResult = []


    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "database search query ref: " + databaseQueryPath, global.defineManager.LOG_LEVEL_DEBUG);

    admin.database().ref(databaseQueryPath).orderByChild(global.defineManager.QUERY_ITEM_ROUTINE_UPLOAD_DATE_TIME_SEC)
        .limitToLast(global.defineManager.SEARCH_LIMIT).on("value", function (snapshot) {

        // global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "search snapshot: " + JSON.stringify(snapshot), global.defineManager.LOG_LEVEL_DEBUG);

        routineDataSnapshot = JSON.parse(JSON.stringify(snapshot))
        for(indexOfRoutineKey in routineDataSnapshot) {
            global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "searching key: " + indexOfRoutineKey, global.defineManager.LOG_LEVEL_DEBUG);

            indexOfRoutineData = routineDataSnapshot[indexOfRoutineKey]

            //user name option
            usernameOption = databaseSearchQuery["username"]
            if(usernameOption != null) {
                if(indexOfRoutineData["writer"].includes(usernameOption)) {
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok username passed: " + indexOfRoutineKey, global.defineManager.LOG_LEVEL_DEBUG)
                }
                else {
                    //cannot found
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "no matching result <username>", global.defineManager.LOG_LEVEL_WARN)
                    continue;
                }
            }
            else {
                //user name option is null
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "username option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            // sexOption = databaseSearchQuery[""]
            timeOption = databaseSearchQuery["time"]
            if(timeOption != null) {
                indexOfRoutineTimeStr = timeOption.join()
                for(indexOfTime in timeOption) {
                    if(indexOfRoutineTimeStr.includes(timeOption[indexOfTime])) {
                        global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok time passed: " + indexOfRoutineKey, global.defineManager.LOG_LEVEL_DEBUG)
                        break;
                    }
                }
            //    cannot found
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "no matching result <time>", global.defineManager.LOG_LEVEL_WARN);
            }
            else{
            //    time option is null
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "time option is null", global.defineManager.LOG_LEVEL_WARN)
            }
            tempResult = {}
            tempResult[indexOfRoutineKey] = indexOfRoutineData
            searchQueryResult.push(tempResult)
        }

        searchQueryResult = searchQueryResult.slice(-global.defineManager.SEARCH_RETURN_LIMIT)

        responseManager.TemplateOfResponse(
            searchQueryResult,
            global.defineManager.HTTP_SUCCESS, response)
    })
}