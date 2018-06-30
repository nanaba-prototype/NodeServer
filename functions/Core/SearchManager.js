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

            passThisRoutine = false

            global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "searching key: " + indexOfRoutineKey, global.defineManager.LOG_LEVEL_DEBUG);

            indexOfRoutineData = routineDataSnapshot[indexOfRoutineKey]

            //user name option
            usernameOption = databaseSearchQuery["username"]
            if(usernameOption != null) {
                if(indexOfRoutineData["writer"].includes(usernameOption)) {
                    passThisRoutine = true
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

            // time option
            timeOption = databaseSearchQuery["time"]
            if(timeOption != null) {
                indexOfRoutineTimeStr = timeOption.join()
                for(indexOfTime in timeOption) {
                    if(indexOfRoutineTimeStr.includes(timeOption[indexOfTime])) {
                        passThisRoutine = true
                        global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok time passed: " + indexOfRoutineKey, global.defineManager.LOG_LEVEL_DEBUG)
                        break;
                    }
                }
            //    cannot found
            //     global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "no matching result <time>", global.defineManager.LOG_LEVEL_WARN);
            }
            else{
            //    time option is null
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "time option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            // sex option
            sexOption = databaseSearchQuery["sex"]
            if(sexOption != null) {
                if(!indexOfRoutineData.hasOwnProperty("sex")) {
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "this routine has not sex", global.defineManager.LOG_LEVEL_WARN)
                    passThisRoutine = false
                    continue;
                }
                for(indexOfSex in sexOption) {
                    if(indexOfRoutineData["sex"] == sexOption[indexOfSex]) {
                        passThisRoutine = true
                        global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok sex passed", global.defineManager.LOG_LEVEL_INFO)
                        break;
                    }
                }
            }
            else {
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "sex option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            // skin type option
            skinTypeOption = databaseSearchQuery["skinType"]
            if(skinTypeOption != null) {
                if(!indexOfRoutineData.hasOwnProperty("skinType")) {
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "this routine has not skin type", global.defineManager.LOG_LEVEL_WARN)
                    passThisRoutine = false
                    continue;
                }
                for(key in indexOfRoutineData["skinType"]) {
                    if(skinTypeOption.includes(indexOfRoutineData["skinType"][key])) {
                        passThisRoutine = true
                        global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok skin type passed", global.defineManager.LOG_LEVEL_INFO)
                        break;
                    }
                }
            }
            else {
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "skinType option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            // skin concern
            skinConcernOption = databaseSearchQuery["skinConcern"]
            if(skinConcernOption != null) {
                if(!indexOfRoutineData.hasOwnProperty("skinConcern")) {
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "this routine has not skin concern", global.defineManager.LOG_LEVEL_WARN)
                    passThisRoutine = false
                    continue;
                }
                for(key in indexOfRoutineData["skinConcern"]) {
                    if(skinTypeOption.includes(indexOfRoutineData["skinConcern"][key])) {
                        passThisRoutine = true
                        global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok skin concern passed", global.defineManager.LOG_LEVEL_INFO)
                        break;
                    }
                }
            }
            else {
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "skin concern option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            // age
            ageOption = databaseSearchQuery["ageGroup"]
            if(ageOption != null) {
                if(!indexOfRoutineData.hasOwnProperty("birthYear")) {
                    global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "this routine has not age", global.defineManager.LOG_LEVEL_WARN)
                    passThisRoutine = false
                    continue;
                }
                date = new Date()
                currentYear = date.getFullYear()
                writerAge = Number(currentYear) - Number(indexOfRoutineData["birthYear"])
                for(indexOfSearchAge in ageOption) {
                    switch (ageOption[indexOfSearchAge]) {
                        case global.defineManager.SEARCH_AGE_GROUP_18_29:
                            if(18 <= writerAge && writerAge < 29) {
                                passThisRoutine = true;
                                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok age passed", global.defineManager.LOG_LEVEL_INFO)
                                break;
                            }
                            break;
                        case global.defineManager.SEARCH_AGE_GROUP_30_39:
                            if(30 <= writerAge && writerAge < 39) {
                                passThisRoutine = true;
                                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok age passed", global.defineManager.LOG_LEVEL_INFO)
                                break;
                            }
                            break;
                        case global.defineManager.SEARCH_AGE_GROUP_40_49:
                            if(40 <= writerAge && writerAge < 49) {
                                passThisRoutine = true;
                                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok age passed", global.defineManager.LOG_LEVEL_INFO)
                                break;
                            }
                            break;
                        case global.defineManager.SEARCH_AGE_GROUP_50:
                            if(50 <= writerAge) {
                                passThisRoutine = true;
                                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "ok age passed", global.defineManager.LOG_LEVEL_INFO)
                                break;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            else {
                global.logManager.PrintLogMessage("SearchManager", "SearchRoutines", "age option is null", global.defineManager.LOG_LEVEL_WARN)
            }

            //passed result
            if(passThisRoutine) {
                tempResult = {}
                tempResult[indexOfRoutineKey] = indexOfRoutineData
                searchQueryResult.push(tempResult)
            }
        }

        searchQueryResult = searchQueryResult.slice(-global.defineManager.SEARCH_RETURN_LIMIT)

        responseManager.TemplateOfResponse(
            searchQueryResult,
            global.defineManager.HTTP_SUCCESS, response)
    })
}