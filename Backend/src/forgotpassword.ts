import axios from "axios";

export{}
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("url", MONGODB_URI);



exports.handler = async (event, context) => {
    let body = JSON.parse(event.body)
    console.log("body", body);
    // let body = {
    //     "email": "vikas@gmail.com",
    //     "password" : "System@1234",
    //     "repassword" : "System@123",
    //     "OTP" : "2990"

    // }
    const client = await MongoClient.connect(MONGODB_URI);
  try {
    await client.connect();
    const db = await client.db("trading-app-dev");
    const collection = db.collection('LEARN_USERS');

    // Check if data with the provided ID exists
    console.log("inn side remove")
    const existingData = await collection.findOne({ email: body.email });
    console.log("existing data", existingData);
    let otp = existingData.OTP;
    console.log("OTP nk",otp);
    console.log("OTP body",body.OTP);

    if(existingData == null)
    {
        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({ message: 'User not found' }),
        //   };
        const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
        body: JSON.stringify({ message: 'User not found' }),
    };
          return response;
    }
      // If data exists, delete it
    //   await collection.updateOne({totalviews: incrementValue });


    if(existingData.password == body.password)
    {
        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({ message: 'Same Password is not allowed',referrercode : '1001' }),
        //   };
        const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: 'Same Password is not allowed',responseCode : '1001' }),
            };
          return response;
    }
    if(Number(otp) != Number(body.OTP))
    {
        console.log("inside otp");
        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({ message: 'OTP did not match',referrercode : '1001' }),
        //   };
        const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: 'OTP did not match',responseCode : '1001' }),
            };
          return response;
    }
    if(Number(otp) == Number(body.OTP))
    {
        const updateDB = await db.collection("LEARN_USERS").updateOne( { email: body.email }, { $set: { password: body.password} } )           
        // return {
        //   statusCode: 200,
        //   body: JSON.stringify({ message: 'view updated',referrercode : '1000' }),
        // };
        const response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({ message: 'view updated',responseCode : '1000',details : updateDB }),
            };
          return response;
    }

    
  } catch (error) {
    console.error('Error deleting data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } 
    }