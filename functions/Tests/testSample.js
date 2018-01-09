const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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

exports.fcmToAll = functions.https.onRequest((request, responseToClient) => {
    var responseMessage = {}
    var payload = {
        data: {
            score: "850",
            time: "2:45"
        }
    };
var topic = "/topics/test"
admin.messaging().sendToTopic(topic, payload)
    .then(function(response) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response);

        responseMessage = {"result" : "ok", "message" : response}

        responseToClient.setHeader('Content-Type', 'application/json');
        responseToClient.status(200).send(JSON.stringify(responseMessage))

    })
    .catch(function(error) {
        console.log("Error sending message:", error);

        responseMessage = {"result" : "fail"}

        responseToClient.setHeader('Content-Type', 'application/json');
        responseToClient.status(200).send(JSON.stringify(responseMessage))
    });
});