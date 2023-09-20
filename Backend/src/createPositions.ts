const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');
var nodemailer = require('nodemailer');

export {}
const currentDateAndTime = new Date();
const OTP = Math.floor(1000 + Math.random() * 9000);
console.log(OTP);

const currentYear = currentDateAndTime.getFullYear();
const currentMonth = currentDateAndTime.getMonth() + 1; // Months are 0-indexed, so add 1
const currentDay = currentDateAndTime.getDate();
const currentHours = currentDateAndTime.getHours();
const currentMinutes = currentDateAndTime.getMinutes();
const currentSeconds = currentDateAndTime.getSeconds();


// let Testevent:any = 
// {
//   "path" : "resend",
//   "user_id" : "learn_0000001",
//   "full_name" : "Vikas Chandra Guru",
//   "Phone_Number" : "9731243153",
//   "email" : "vikastheshit@gmail.com",
//   "password" : "password",
//   "device_info" : {
//     "isMobile" : false,
//     "isTablet" : false,
//     'isDesktop': true,
//     "deviceType" : "",
//     "OS" : "",
//     "osVersion" : "",
//     "screen_resolution": "",
//     "userAgent" : ""
//   },
//   "created_date" : `${currentDay}-${currentMonth}-${currentYear}:${currentHours}:${currentMinutes}:${currentSeconds}`,
//   "language" : "",
//   "firebase_token" : "",
//   "isActive" : true,
//   "isBanned" : false
// }
//   "path" : "create",
//   "user_id": "learn_Admin",
//   "full_name": "Alessio Devangelista",
//   "Phone_Number": "12345671891",
//   "email": "alessiodevangelista@l-earn.com",
//   "password": "password",
//   "device_info": {
//       "isMobile": false,
//       "isTablet": false,
//       "isDesktop": true,
//       "deviceType": "",
//       "OS": "",
//       "osVersion": "",
//       "screen_resolution": "",
//       "userAgent": ""
//   },
//   "created_date":"10-09-2023:03:53:22",
//   "language": "",
//   "firebase_token": "",
//   "isActive": true,
//   "isBanned":false,
//   "isAdmin" : true
// }


// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI;
let cachedDb = null;




async function createUserinDB(payload) {
  console.log("payload",payload);
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    // Get a reference to the database and collection
    const db = client.db('trading-app-dev');
    const collection = db.collection('LEARN_POSITIONS');
    console.log("data",payload)
    
    // Insert user data into the collection
    const result = await collection.insertOne(payload);

    // Close the MongoDB connection
    client.close();
    return {
      statusCode: 200,
      'headers': {
        'Access-Control-Allow-Origin': '*'
    },
      body: JSON.stringify({ message: `${payload.category} Position created successfully`, responseCode:'1000',result}),
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating user' }),
    };
  }
  
}



exports.handler = async (event) => {
//   let TestEvent = {
//     "coinTitle": "BTC/USDT",
//     "percentage": 4,
//     "entryPrice": 1.23,
//     "averagePrice": 2.48,
//     "takeProfit": 4,
//     "portfolio": "1",
//     "shortlong": "1",
//     "createdTime": "21-09-2023- 02:12:25",
//     "category": "opened",
//     "status": true
// }

// let TestEvent = {
//     "openDate": "2023-09-09T05:29",
//     "closedEntryPrice": 1,
//     "closeDate": "2023-09-07T05:28",
//     "closedExitPrice": 1,
//     "status": true,
//     "category": "closed",
//     "createdTime": "21-09-2023- 02:12:25"
// }

  let body = JSON.parse(event.body)
// let body = TestEvent
  console.log("body", body);
  let client;
  if(body.category == "opened")
  {

    try {
      // Extract the email from the event (adjust the property name as needed)
      // Connect to MongoDB
      client = new MongoClient(MONGODB_URI);
     await client.connect();
  
      const db = client.db('trading-app-dev');
     const newUser = await createUserinDB(body);
    return newUser;
    } catch (error) {
      console.error("Error:", error);
      return {
        statusCode: 500,
        'headers': {
          'Access-Control-Allow-Origin': '*'
      },
        body: JSON.stringify({ error: "Internal Server Error from API" }),
      };
    } finally {
      if (client) {
        client.close();
      }
    }
  
  }
  else if(body.category == "closed"){
    try {
        // Extract the email from the event (adjust the property name as needed)
        // Connect to MongoDB
        client = new MongoClient(MONGODB_URI);
       await client.connect();
    
        const db = client.db('trading-app-dev');
       const newUser = await createUserinDB(body);
      return newUser;
      } catch (error) {
        console.error("Error:", error);
        return {
          statusCode: 500,
          'headers': {
            'Access-Control-Allow-Origin': '*'
        },
          body: JSON.stringify({ error: "Internal Server Error from API" }),
        };
      } finally {
        if (client) {
          client.close();
        }
      }
  }

}
