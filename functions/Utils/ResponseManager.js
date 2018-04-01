exports.TemplateOfResponse = function (responseJsonDicData, responseCode, response) {
    template = {}
    template["code"] = responseCode
    template["data"] = responseJsonDicData

    response.setHeader('Content-Type', 'application/json');
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    response.status(responseCode).send(JSON.stringify(template));
}