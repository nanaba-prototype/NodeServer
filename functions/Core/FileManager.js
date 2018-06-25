exports.UploadFile = function (admin, bucket, request, response, responseManager, requestFile) {
    if(requestFile != null) {
        global.logManager.PrintLogMessage("FileManager", "UploadFile", "file upload successfully", global.defineManager.LOG_LEVEL_DEBUG)
        global.logManager.PrintLogMessage("FileManager", "UploadFile", "file name: " + requestFile.originalname, global.defineManager.LOG_LEVEL_DEBUG)

        this.UploadFileToGoogleStorage(requestFile, bucket)
            .then(function (success) {
                global.logManager.PrintLogMessage("FileManager", "UploadFile", "file upload successfully url: " + success, global.defineManager.LOG_LEVEL_DEBUG)

                responseManager.TemplateOfResponse(
                    {"msg": global.defineManager.MESSAGE_SUCCESS},
                    global.defineManager.HTTP_SUCCESS, response)
            })
            .catch(function (except) {
                global.logManager.PrintLogMessage("FileManager", "UploadFile", "failed to upload file: " + except, global.defineManager.LOG_LEVEL_ERROR)

                responseManager.TemplateOfResponse(
                    {"msg": global.defineManager.MESSAGE_FAILED},
                    global.defineManager.HTTP_SERVER_ERROR, response)
            })
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

exports.UploadFileToGoogleStorage = function (file, bucket) {
    subPromise = new Promise(function (resolve, reject) {
        if(file == null) {
            global.logManager.PrintLogMessage("FileManager", "UploadFileToGoogleStorage", "file not exist", global.defineManager.LOG_LEVEL_WARN)
            reject('no file');
        }

        newFileName = file.originalname + "_" + Date.now();

        global.logManager.PrintLogMessage("FileManager", "UploadFileToGoogleStorage", "new file name: " + newFileName, global.defineManager.LOG_LEVEL_DEBUG)

        fileUploader = bucket.file(newFileName)

        blobStream = fileUploader.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })

        blobStream.on('error', function (error) {
            global.logManager.PrintLogMessage("FileManager", "UploadFileToGoogleStorage", "cannot upload file to google server except: " + error, global.defineManager.LOG_LEVEL_ERROR)
            reject('error: ' + error)
        })

        blobStream.on('finish', function () {
            urlStr = "https://storage.googleapis.com/nanaba-server.appspot.com/" + fileUploader.name
            global.logManager.PrintLogMessage("FileManager", "UploadFileToGoogleStorage", "file uploaded successfully url: " + urlStr, global.defineManager.LOG_LEVEL_DEBUG)
            resolve(urlStr)
        })

        blobStream.end(file.buffer)
    })

    return subPromise
}