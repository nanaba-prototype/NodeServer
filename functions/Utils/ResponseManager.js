exports.TemplateOfResponse = function (responseJsonDicData, responseCode, response) {
    template = {}
    template["code"] = responseCode
    template["data"] = responseJsonDicData

    response.setHeader('Content-Type', 'application/json');
    response.status(responseCode).send(JSON.stringify(template));
}