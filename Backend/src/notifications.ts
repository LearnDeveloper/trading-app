const https = require('https');
var AWS = require('aws-sdk');

export {}

exports.handler = (event, context, callback) => {
    let TestEvent = {
        title : "Title"
    }
    processNotification(TestEvent, context);
};

function processNotification(notificationData, context) {
    console.log(notificationData);
    const FIREBASE_API_KEY = '<YOUR-FIREBASE-API-KEY>';
    const data = JSON.stringify({
        message: {
            topic: 'common',
            notification: {
                body: notificationData.message,
                title: notificationData.title
            }
        }
    });
    const options = {
        host: 'fcm.googleapis.com',
        path: '/v1/projects/<YOUR-PROJECT-ID>/messages:send',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + FIREBASE_API_KEY,
            'Content-Type': 'application/json'
        }

    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', (d) => {
            process.stdout.write(d)
        })

    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.write(data)
    req.end();
    return context.succeed(buildSuccessResponse(data));

}

function buildSuccessResponse(data) {
    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    };
}