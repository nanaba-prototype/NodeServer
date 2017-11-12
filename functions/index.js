const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log("Print hello message");
    response.send("Hello from Firebase!");
});

exports.jsonTest = functions.https.onRequest((request, response) => {

    var resultMethod = ""
    var resultContentType = ""
    switch(request.method) {
        case 'POST':
            console.log("post request")
    break;
            case 'GET':
                console.log("get request")
    break;
                default:
                    break;
}
    resultMethod = request.method
    switch(request.get('content-type')) {
        case 'application/json':
            console.log("hello json")
    break;
            default:
                console.log("who are u?")
    break;
}
    resultContentType = request.get('content-type')
    requestMessage = request.body
    console.log(requestMessage);
    // requestMessage = JSON.parse(requestMessage)
    requestBodyData = []
    for (key in requestMessage) {
        console.log("key: " + key + " value: " + requestMessage[key])
        requestBodyData.push([key, requestMessage[key]])
    }
    responseMessage = {"result" : "ok", "method" : resultMethod, "content-type" : resultContentType, "request message": requestBodyData}

   response.setHeader('Content-Type', 'application/json');
   response.status(200).send(JSON.stringify(responseMessage))
});