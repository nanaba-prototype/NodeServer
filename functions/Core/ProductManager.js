exports.GetProductDetailInfo = function (admin, response, responseManager, request) {
    targetPid = request.query.pid

    global.logManager.PrintLogMessage("ProductManager", "GetProductDetailInfo",
        "getting detail info pid: " + targetPid,
        global.defineManager.LOG_LEVEL_INFO)

    admin.database().ref('/Product/' + targetPid + '/').on("value", function (productInfoSnapshot) {

        global.logManager.PrintLogMessage("ProductManager", "GetProductDetailInfo", "product data: " + JSON.stringify(productInfoSnapshot),
            global.defineManager.LOG_LEVEL_INFO)

        responseManager.TemplateOfResponse(productInfoSnapshot, global.defineManager.HTTP_SUCCESS, response)
    })
}