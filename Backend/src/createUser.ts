const { MongoClient } = require('mongodb');
const AWS = require('aws-sdk');
var nodemailer = require('nodemailer');

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
async function getLastUserID() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(MONGODB_URI);

  // Specify which database we want to use
  const db = await client.db("trading-app-dev");

  cachedDb = db;
  const LastUserId = await db
  .collection("LEARN_USERS").find()
  .sort({ _id: -1 }).limit(1).toArray();
  client.close();
  return LastUserId;
}

async function generateUserID(user){
// Input string representing the number with leading zeros
const inputStr = user[0].user_id.split('_')[1];
console.log("inputStr",inputStr);


// Convert the input string to a number
const currentNumber = parseInt(inputStr, 10);

// Increment the number by one
const incrementedNumber = currentNumber + 1;

// Determine the desired width of the output string (including leading zeros)
const width = inputStr.length;

// Format the incremented number as a string with leading zeros
const formattedStr = String(incrementedNumber).padStart(width, "0");

console.log(formattedStr); // Output: "0000002"
return formattedStr;
}



async function createUserinDB(id,payload) {
  console.log("payload",payload);
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    // Get a reference to the database and collection
    const db = client.db('trading-app-dev');
    const collection = db.collection('LEARN_USERS');

    let data :any = {
      "user_id" : `learn_${id}`,
      "full_name" : payload.full_name,
      "Phone_Number" : payload.Phone_Number,
      "email" : payload.email,
      "password" : payload.password,
      "device_info" : {
        "isMobile" : payload.device_info.isMobile,
        "isTablet" : payload.device_info.isTablet,
        'isDesktop': payload.device_info.isDesktop,
        "deviceType" : payload.device_info.deviceType,
        "OS" : payload.device_info.OS,
        "osVersion" : payload.device_info.osVersion,
        "screen_resolution": payload.device_info.screen_resolution,
        "userAgent" : payload.device_info.userAgent,
      },
      "created_date" : `${currentDay}-${currentMonth}-${currentYear}:${currentHours}:${currentMinutes}:${currentSeconds}`,
      "language" : payload.language,
      "firebase_token" : payload.firebase_token,
      "isActive" : payload.isActive,
      "isBanned" : false,
      "OTP" : OTP
    }

    console.log("data",data)
    
    // Insert user data into the collection
    const result = await collection.insertOne(data);

    // Close the MongoDB connection
    client.close();
    const sendMail = await sendOTP(payload);
    console.log(sendMail);
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

async function sendOTP(payload) {
var transport = nodemailer.createTransport({
  pool: true,
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "notify@l-earn.pro",
    pass: "Notify@2023l-earnPro",
  },
});

console.log('SMTP Configured');

// Message object
  var message = {

  // sender info
  from: 'notify@l-earn.pro',

   // Comma separated list of recipients
  to: payload.email,

   // Subject of the message
  subject: "check", //'Nodemailer is unicode friendly ✔', 

  // plaintext body
  //  text: "Hello" //'Hello to myself!',

  // HTML body
   html:'<span style="text-align:left;background-color: linear-gradient(220deg, rgba(246,246,246,1) 50%, rgba(140,159,255,1) 100%)"><h1 style="padding:20px;"><b>Welcome to L-EARN</b></h1><br>'+
     '<p style="text-align:"left">Dear'+payload.full_name+'</p><br><p>Thank you for signing up for our service. We are excited to have you as a member!</p><br><p>Here are some key details about your account:</p><br><ul><li>Email:'+payload.full_name+'</li><li>Password:'+payload.password+'</li><li>OTP:'+OTP+'</li></ul><br><p>If you have any questions or need assistance, please dont hesitate to contact us.</p><br><p>Best regards,<br>L-earn Team</p></span>'
  };

  console.log('Sending Mail');
  transport.sendMail(message, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
});
}

async function resendOTP(payload) {
  var transport = nodemailer.createTransport({
    pool: true,
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: "notify@l-earn.pro",
      pass: "Notify@2023l-earnPro",
    },
  });
  
  console.log('SMTP Configured');
  
  // Message object
    var message = {
  
    // sender info
    from: 'notify@l-earn.pro',
  
     // Comma separated list of recipients
    to: payload.email,
  
     // Subject of the message
    subject: "check", //'Nodemailer is unicode friendly ✔', 
  
    // plaintext body
    //  text: "Hello" //'Hello to myself!',
  
    // HTML body
     html:'<span style="text-align:left;background-color: linear-gradient(220deg, rgba(246,246,246,1) 50%, rgba(140,159,255,1) 100%)"><h1 style="padding:20px;"><b>Welcome to L-EARN</b></h1><br>'+
       '<p style="text-align:"left">Dear'+payload.full_name+'</p><br><p>Hello '+payload.email+' the OTP is '+OTP+'!</p><br><p>If you have any questions or need assistance, please dont hesitate to contact us.</p><br><p>Best regards,<br>L-earn Team</p></span>'
    };
  
    console.log('Sending Mail');
    transport.sendMail(message, function(error){
    if(error){
    console.log('Error occured');
    console.log(error.message);
    return;
    }
  });
  }

exports.handler = async (event) => {


  let body = JSON.parse(event.body)
  console.log("body", body);
  let client;
  if(body.path == "create")
  {

    try {
      // Extract the email from the event (adjust the property name as needed)
      const emailToCheck = body.email;
      const phoneNumberToCheck = body.Phone_Number
  
      // Connect to MongoDB
      client = new MongoClient(MONGODB_URI);
      await client.connect();
  
      const db = client.db('trading-app-dev');
      const collection = db.collection('LEARN_USERS');
  
      // Check if the email exists in the MongoDB collection
      const existingUser = await collection.findOne({ email: emailToCheck });
      const existingPhoneUser = await collection.findOne({ phoneNumber: phoneNumberToCheck });
  
      if (existingUser || existingPhoneUser) {
        // Email exists in the collection, return an error response
        return {
          statusCode: 200,
          'headers': {
            'Access-Control-Allow-Origin': '*'
        },
          body: JSON.stringify({ error: "Email ID or Phone Number already exists",responseCode:"1001" }),
        };
      } else {
        
  
  
    const lastUserID = await getLastUserID();
    const newUserID = await generateUserID(lastUserID);
    const newUser = await createUserinDB(newUserID,body);
    return newUser;
      }
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
  else if(body.path == "resend")
  {
    const resend = await resendOTP(body);
    return resend;
  }

}
