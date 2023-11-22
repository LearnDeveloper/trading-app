var nodemailer = require('nodemailer');
export{}
const MongoClient = require("mongodb").MongoClient;

// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.
const MONGODB_URI = process.env.MONGODB_URI;
console.log("url", MONGODB_URI);
const OTP = Math.floor(1000 + Math.random() * 9000);
console.log(OTP);
// https://app.redtie.co:2021/apiv4/blockchain/nft/token/list?apikey=RVY0VnVLUDhQSHZST2hFM04xcnFnZDkzU2J2bGtZVVM1S2NNaXY2NHh4cmhhdEM5cjMyMTJaMXA&secret=R1eqD2twI3E4&user_id=61aa616f2f3079488cb37658&business_id=62700d79471c2e18b2568268&flag=all&tab=accepted
// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb = null;

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

// async function sendOTP(payload): Promise<void> {

async function resendOTP(email):Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // Set to true if your SMTP server requires a secure connection (e.g., for Gmail, set it to true)
    auth: {
        user: 'notify@l-earn.pro',
        pass: 'Notify@2023l-earnPro',
    },
});
    
    console.log('SMTP Configured');
    
    // Message object
      var message = {
    
      // sender info
      from: 'notify@l-earn.pro',
    
       // Comma separated list of recipients
      to: email,
    
       // Subject of the message
      subject: "L-EARN OTP", //'Nodemailer is unicode friendly ✔', 
    
      // plaintext body
      //  text: "Hello" //'Hello to myself!',
    
      // HTML body
       html:'<span style="text-align:left;background-color: linear-gradient(220deg, rgba(246,246,246,1) 50%, rgba(140,159,255,1) 100%)"><h1 style="padding:20px;"><b>Welcome to L-EARN</b></h1><br>'+
         '<p style="text-align:"left">D</p><br><p>Hello ' +email+ '<br><h1 style="text-align:left"> the OTP is '+OTP+'!</h1></p><br><p>If you have any questions or need assistance, please dont hesitate to contact us.</p><br><p>Best regards,<br>L-earn Team</p></span>'
      };
    
      console.log('Sending Mail');
      return new Promise<void>((resolve, reject) => {
      transporter.sendMail(message,  (error, info) => {
        if (error) {
          reject(error);
          console.error('Error sending email:', error);
        } else {
          resolve( )
          console.log('Email sent:', info.response);
          // let finalData =  info.response;
          // return finalData;
        }
    });
        });
    }
  



exports.handler = async (event) => {
 
    let body = JSON.parse(event.body)
    console.log("body", body);
    // let email = body.email;
    // let otp = body.otp;

    // let body = {
    //     email:"vikivikas41@gmail.com",
    //     otp : ""
    // }
  
  let email = body.email;
    // let otp = body.otp;
  const db = await connectToDatabase();


  // // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
  const filter = { email: email };
  const update = { $set: { OTP: OTP } };

  const userDetails = await db
    .collection("LEARN_USERS")
    .updateOne(filter,update);
  console.log("userDatai", userDetails);  

  const emailResponse = await resendOTP(email);
  console.log("email Reponse", emailResponse);
  // if(emailResponse != '' || emailResponse != undefined || )
  // {

  // }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify({
        data : emailResponse,
        responseCode : "1000"
    }),
  };
  console.log("response", response);
  return response;
  // console.log("email Response", emailResponse);
  // return emailResponse;
  
};
