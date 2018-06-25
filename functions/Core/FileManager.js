exports.UploadFile = function (admin, storage, request, response, responseManager, requestFile) {
    if(requestFile != null) {
        global.logManager.PrintLogMessage("FileManager", "UploadFile", "file upload successfully", global.defineManager.LOG_LEVEL_DEBUG)
        global.logManager.PrintLogMessage("FileManager", "UploadFile", "file name: " + requestFile.originalname, global.defineManager.LOG_LEVEL_DEBUG)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_SUCCESS},
            global.defineManager.HTTP_SUCCESS, response)
    }
    else {
        global.logManager.PrintLogMessage("FileManager", "UploadFile", "file upload failed", global.defineManager.LOG_LEVEL_WARN)

        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    }
}

exports.UploadFile2 = function (admin, storage, request, response, responseManager, Busboy) {
    busboy = new Busboy({
        headers: request.headers
    })

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        global.logManager.PrintLogMessage("FileManager", "UploadFile2", "file name: " + filename, global.defineManager.LOG_LEVEL_DEBUG)
    })

    busboy.on('finish', function () {
        global.logManager.PrintLogMessage("FileManager", "UploadFile2", "file upload done", global.defineManager.LOG_LEVEL_INFO)
        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_SUCCESS},
            global.defineManager.HTTP_SUCCESS, response)
    })

    busboy.on('error', function (except) {
        global.logManager.PrintLogMessage("FileManager", "UploadFile2", "cannot upload file: " + except, global.defineManager.LOG_LEVEL_ERROR)
        responseManager.TemplateOfResponse(
            {"msg": global.defineManager.MESSAGE_FAILED},
            global.defineManager.HTTP_REQUEST_ERROR, response)
    })

    if (request.rawBody) {
        busboy.end(request.rawBody);
    }
    else {
        request.pipe(busboy);
    }

    // busboy.end(request.rawBody)
}