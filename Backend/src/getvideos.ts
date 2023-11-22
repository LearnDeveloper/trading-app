import axios from "axios";

export{}
const MongoClient = require("mongodb").MongoClient;

// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.
const MONGODB_URI = process.env.MONGODB_URI;
console.log("url", MONGODB_URI);
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


exports.handler = async (event, context) => {

  const db = await connectToDatabase();

  // // Make a MongoDB MQL Query to go into the movies collection and return the first 20 movies.
  const userDetails = await db
    .collection("LEARN_MAIN_FEEDS_VIDEO")
    .find({})
    .toArray();

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(userDetails),
  };

  return response;
};
