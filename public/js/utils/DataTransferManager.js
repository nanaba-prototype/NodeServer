function DataTransferManager(token) {
    PrintLogMessage("DataTransferManager", "DataTransferManager", "init", LOG_LEVEL_INFO)
    $.ajaxSetup({
        beforeSend: function(xhr) {
            PrintLogMessage("DataTransferManager", "DataTransferManager", "setup auth: " + token, LOG_LEVEL_DEBUG)
            xhr.setRequestHeader('Authorization', token);
        }
    });
}

DataTransferManager.prototype.PostRequest = function (url, data, callbackObj, token) {
    PrintLogMessage("DataTransferManager", "PostRequest", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        crossDomain : true,
        // headers: {
        //     "Authorization": token
        // },
        xhrFields: {
            withCredentials: false
        },
        // beforeSend: function (xhr) {
        //     PrintLogMessage("DataTransferManager", "PostRequest", "auth: " + token, LOG_LEVEL_DEBUG)
        //     xhr.setRequestHeader ("Authorization", token);
        // }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "PostRequest", "data received successfully", LOG_LEVEL_INFO)
            callbackObj.RequestSuccess(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "PostRequest", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            callbackObj.RequestFail(xhr.responseText, textStatus)
        });
}

DataTransferManager.prototype.PostRequestWithCallbackFunc = function (url, data, successFunc, failFunc, token) {
    PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        crossDomain : true,
        // headers: {
        //     "Authorization": token
        // },
        xhrFields: {
            withCredentials: false
        },
        // beforeSend: function (xhr) {
        //     PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "auth: " + token, LOG_LEVEL_DEBUG)
        //     xhr.setRequestHeader ("Authorization", token);
        // }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "data received successfully", LOG_LEVEL_INFO)
            successFunc(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "PostRequestWithCallbackFunc", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            failFunc(xhr.responseText, textStatus)
        });
}

DataTransferManager.prototype.GetRequest = function (url, data, callbackObj, token) {
    PrintLogMessage("DataTransferManager", "GetRequest", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        crossDomain : true,
        // headers: {
        //     "Authorization": token
        // },
        xhrFields: {
            withCredentials: false
        },
        // beforeSend: function (xhr) {
        //     PrintLogMessage("DataTransferManager", "GetRequest", "auth: " + token, LOG_LEVEL_DEBUG)
        //     xhr.setRequestHeader ("Authorization", token);
        // }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "GetRequest", "data received successfully", LOG_LEVEL_INFO)
            callbackObj.RequestSuccess(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "GetRequest", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            callbackObj.RequestFail(xhr.responseText, textStatus)
        });
}

DataTransferManager.prototype.GetRequestWithCallbackFunc = function (url, data, successFunc, failFunc, token) {
    PrintLogMessage("DataTransferManager", "GetRequest", "send data to url: " + url, LOG_LEVEL_INFO)
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: url,
        contentType: 'application/x-www-form-urlencoded',
        data: data,
        async: false,
        crossDomain : true,
        // headers: {
        //     "Authorization": token
        // },
        xhrFields: {
            withCredentials: false
        },
        // beforeSend: function (xhr) {
        //     PrintLogMessage("DataTransferManager", "GetRequestWithCallbackFunc", "auth: " + token, LOG_LEVEL_DEBUG)
        //     xhr.setRequestHeader ("Authorization", token);
        // }
    })
        .done(function( receivedData ) {
            PrintLogMessage("DataTransferManager", "GetRequestWithCallbackFunc", "data received successfully", LOG_LEVEL_INFO)
            successFunc(receivedData)
        })
        .fail( function(xhr, textStatus, errorThrown) {
            PrintLogMessage("DataTransferManager", "GetRequestWithCallbackFunc", "something has problem: " + textStatus, LOG_LEVEL_ERROR)
            failFunc(xhr.responseText, textStatus)
        });
}