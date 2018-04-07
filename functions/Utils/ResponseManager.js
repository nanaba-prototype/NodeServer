exports.TemplateOfResponse = function (responseJsonDicData, responseCode, response) {

    global.logManager.PrintLogMessage("ResponseManager", "TemplateOfResponse", "res code: " + responseCode,
        global.defineManager.LOG_LEVEL_DEBUG)

    template = {}
    template["code"] = responseCode
    template["data"] = responseJsonDicData

    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader('Access-Control-Allow-Methods', '*')
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Allow-Credentials", true)
    response.setHeader('Access-Control-Request-Method', '*');
    response.status(responseCode).send(JSON.stringify(template));
}