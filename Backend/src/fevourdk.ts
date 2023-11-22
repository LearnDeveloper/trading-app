const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');
export {}
const OTP = Math.floor(1000 + Math.random() * 9000);
console.log(OTP);

let Testevent = {
    "district": "Bagalkote",
    "name": "sadasd",
    "dob": "2023-09-28",
    "gender": "male",
    "handicap": "male",
    "permanentAddress": "asdasd",
    "education": "asdasdasas",
    "mobileno": "dasdas",
    "whatsappmobileno": "dasd",
    "benefits": "asdasdasd",
    "email": "asdasd",
    "serviceRecord": [
        {
            "yeartoyear": "asdasd",
            "orgdist": "asdasd",
            "period": "asdasda",
            "position": "sd"
        },
        {
            "yeartoyear": "asdasd",
            "orgdist": "asdasd",
            "period": "asdasd",
            "position": "asdasdasda"
        }
    ],
    "presentOrgDetails": [
        {
            "orgyeartoyear": "sdasda",
            "orgorgdist": "sdasd",
            "orgposition": "asdasd",
            "orgsalary": "asdasda",
            "orgorgname": "sdasd"
        },
        {
            "orgyeartoyear": "asdasdasdas",
            "orgorgdist": "dasdaasdasd",
            "orgposition": "sdasd",
            "orgsalary": "asdasdas",
            "orgorgname": "asdasd"
        }
    ],
    "expectation": [
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        false
    ]
}

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
    const collection = db.collection('VIKASANA_USERS');

    // Insert user data into the collection
    const result = await collection.insertOne(payload);

    // Close the MongoDB connection
    client.close();
    return {
      statusCode: 200,
      'headers': {
        'Access-Control-Allow-Origin': '*'
    },
      body: JSON.stringify({ message: 'User created successfully', insertedId: result.insertedId }),
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
  let body = JSON.parse(event.body)
  console.log("body", body);
    const newUser = await createUserinDB(body);
    return newUser;
      
}
