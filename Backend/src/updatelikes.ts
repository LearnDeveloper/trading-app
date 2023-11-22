import axios from "axios";

export{}
const MongoClient = require("mongodb").MongoClient;

// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.
const MONGODB_URI = process.env.MONGODB_URI;
console.log("url", MONGODB_URI);
// https://app.redtie.co:2021/apiv4/blockchain/nft/token/list?apikey=RVY0VnVLUDhQSHZST2hFM04xcnFnZDkzU2J2bGtZVVM1S2NNaXY2NHh4cmhhdEM5cjMyMTJaMXA&secret=R1eqD2twI3E4&user_id=61aa616f2f3079488cb37658&business_id=62700d79471c2e18b2568268&flag=all&tab=accepted
// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb = null;

// async function connectToDatabase() {
//   if (cachedDb) {
//     return cachedDb;
//   }

//   // Connect to our MongoDB database hosted on MongoDB Atlas
//   const client = await MongoClient.connect(MONGODB_URI);

//   // Specify which database we want to use
//   const db = await client.db("trading-app-dev");

//   cachedDb = db;
//   return db;
// }


exports.handler = async (event, context) => {
    let body = JSON.parse(event.body)
    console.log("body", body);
    // let body = {
    //     "userId": "learn_0000001",
    //     "id": "1",
    //     "action" : "remove"
    // }
    // let TestEvent = {
    //     email: "vikas@gmail.com",
    // }
    // let body = {
    //     "token" : "c8CNMzvn3jV1OrEZ6uPfja:APA91bF5bl0238jgDyfNu8mluSBYSMPQJ0NreZDV7hEltXyppUcAS9-KwvLsTQrDsef_fYy_4c1rDEVCjn9Qp0LyQ8gPgs8pcPb8UpdGIk7pTsfS4ZICb5YFaf7W8IMiBp2eh98F9uT8"
    // }
    // let body = JSON.parse(event.body)
    // console.log("body", body);
    const client = await MongoClient.connect(MONGODB_URI);
    const db = await client.db("trading-app-dev");
    const collection = db.collection('LEARN_USERS_LIKES');
//   // Connect to our MongoDB database hosted on MongoDB Atlas
//   const client = await MongoClient.connect(MONGODB_URI);

//   // Specify which database we want to use

    // Specify which database we want to use
    if(body.action == 'add'){
        const result = await collection.insertOne(body);
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
          body: JSON.stringify({responseCode: 1000,message:"Token Added Successfully",body}),
        };
       return response;
    }
    if(body.action == 'remove')
    {
    //     const response = {
    //       statusCode: 200,
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Access-Control-Allow-Headers": "*",
    //       },
    //       body: JSON.stringify({responseCode: 1000,message:"Token Added Successfully",body}),
    //     };
    //    return response;
    
  try {
    await client.connect();
    const db = await client.db("trading-app-dev");
    const collection = db.collection('LEARN_USERS_LIKES');

    // Check if data with the provided ID exists
    console.log("inn side remove")
    const existingData = await collection.findOne({ userId: body.userId,id: body.id });

    if (existingData) {
      // If data exists, delete it
      const deleteData =  await collection.deleteOne({ userId: body.userId,id: body.id });

      // return {
      //   statusCode: 200,
      //   body: JSON.stringify({ message: 'Data deleted successfully' }),
      // };4
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({responseCode: 1000,message:"Data deleted successfully",deleteData}),
      };
     return response;
    } else {
      // If data does not exist, return a 404 Not Found response
      // return {
      //   statusCode: 404,
      //   body: JSON.stringify({ message: 'Data not found' }),
      // };
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({responseCode: 1000,message:"Data Not Found"}),
      };
     return response;
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } finally {
    client.close();
  }
    }


  
    // if(body.path == 'payment')
    // {
    //   const updateDB =await db.collection("LEARN_USERS").updateOne( { email: body.email }, { $set: { isSubscribed: true} } )       
    //   const getNewData =await db
    //   .collection("LEARN_USERS")
    //   .findOne({email:body.email});      
    //   console.log(updateDB);
    //   const response = {
    //     statusCode: 200,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers": "*",
    //     },
    //     body: JSON.stringify({responseCode: 1000,message:"payment Successfully",updateDB,getNewData}),
    //   };
    //   return response;
    // }
    // if(body.path == 'auth')
    // {
    //   const updateDB =await db.collection("LEARN_USERS").updateOne( { email: body.email }, { $set: { authenticated: true} } )       
    //   const getNewData =await db
    //   .collection("LEARN_USERS")
    //   .findOne({email:body.email});      
    //   console.log(updateDB);
    //   const response = {
    //     statusCode: 200,
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Headers": "*",
    //     },
    //     body: JSON.stringify({responseCode: 1000,message:"SSO Successfully",updateDB,getNewData}),
    //   };
    //   return response;
    // }
};
