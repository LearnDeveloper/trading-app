const AWS = require('aws-sdk');
const MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
export {}

// let dummyData = {
//     email : "alessiodevangelista@l-earn.com",
//     password : "password"
// }
let cachedDb = null;

const MONGODB_URI = process.env.MONGODB_URI;
const dbName = 'trading-app-dev';
const collectionName = 'LEARN_USERS';
const OTP = Math.floor(1000 + Math.random() * 9000);
console.log(OTP);

async function connectToDatabase() {
    if (cachedDb) {
      return cachedDb;
    }
  
    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(MONGODB_URI);
  
    // Specify which database we want to use
    const db = await client.db("trading-app-dev");
  
    cachedDb = db;
    return db;
  }
  

//  async function loginOTP(payload) {
//     var transport = nodemailer.createTransport({
//       pool: true,
//       host: "smtp.hostinger.com",
//       port: 465,
//       secure: true, // use TLS
//       auth: {
//         user: "notify@l-earn.pro",
//         pass: "Notify@2023l-earnPro",
//       },
//     });
    
//     console.log('SMTP Configured');
    
//     // Message object
//       var message = {
    
//       // sender info
//       from: 'notify@l-earn.pro',
    
//        // Comma separated list of recipients
//       to: payload.email,
    
//        // Subject of the message
//       subject: "check", //'Nodemailer is unicode friendly ✔', 
    
//       // plaintext body
//       //  text: "Hello" //'Hello to myself!',
    
//       // HTML body
//        html:'<span style="text-align:left;background-color: linear-gradient(220deg, rgba(246,246,246,1) 50%, rgba(140,159,255,1) 100%)"><h1 style="padding:20px;"><b>Welcome to L-EARN</b></h1><br>'+
//          '<p style="text-align:"left">Dear'+payload.email+'</p><br><p>Please below OTP for Login <br><h2>the OTP is '+OTP+'!</p><br><p>If you have any questions or need assistance, please dont hesitate to contact us.</p><br><p>Best regards,<br>L-earn Team</p></span>'
//       };
    
//       console.log('Sending Mail');
//       transport.sendMail(message, function(error){
//       if(error){
//       console.log('Error occured');
//       console.log(error.message);
//       return;
//       }
//     });
//     }

exports.handler = async (event, context) => {
    // let Testevent = {
    //     email : "vikivikas41@gmail.com",
    //     password : "password"
    // }
    
  
    // const eventData = {"email":"vikastheshit@gmail.com","password":"password"}
    // console.log("eventData", eventData);
    // console.log("event",event.body.email);
    // console.log("event",event.body.password);
    // console.log("eventData email",eventData.email);
    // console.log("eventData pass",eventData.password);
    // console.log("eventData email 0",eventData[0].email);
    // console.log("eventData pass 0",eventData.password);
  //   let testevent = {
  //     "email": "vikas@gmail.com",
  //     "password": "System@123"
  // }
    let body = JSON.parse(event.body)
    // let body = testevent;
    console.log("body", body);
    let email = body.email;
    console.log("email", email);
    let password = body.password;
    console.log("password", password);
    console.log("body Email", email);
    const db = await connectToDatabase();

    // // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
    const userDetails = await db
      .collection("LEARN_USERS")
      .findOne({email: body.email})

      console.log("user details", userDetails);

      if(userDetails == undefined){
        const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify([{
                "error":"User Not Found",
                "responseCode" : "1001"
            }]),
          };
          return response;
      }
   if(userDetails.password != password){
    const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify([{
            "error":"Invalid Credentials",
            "responseCode" : "1001"
        }]),
      };
      return response;
}

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify([{
            data:userDetails,
            "responseCode" : "1000"
        }])
      };
      return response;

};
