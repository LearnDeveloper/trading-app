import axios from "axios";

export{}
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;
console.log("url", MONGODB_URI);



exports.handler = async (event, context) => {
    let body = JSON.parse(event.body)
    console.log("body", body);
    // let body = {
    //     "id": "1",
    // }
    const client = await MongoClient.connect(MONGODB_URI);
  try {
    await client.connect();
    const db = await client.db("trading-app-dev");
    const collection = db.collection('LEARN_MAIN_FEEDS_VIDEO');

    // Check if data with the provided ID exists
    console.log("inn side remove")
    const existingData = await collection.findOne({ id: body.id });
    console.log("existing data", existingData);
    console.log("incrementValue",existingData.totalviews);
    let incrementValue = Number(existingData.totalviews) + 1;
    console.log("incrementValue",incrementValue);
    // return;
    if (existingData) {
      // If data exists, delete it
    //   await collection.updateOne({totalviews: incrementValue });
    db.collection("LEARN_MAIN_FEEDS_VIDEO").updateOne( { id: body.id }, { $set: { totalviews: incrementValue} } )           
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'view updated' }),
      };
    } else {
      // If data does not exist, return a 404 Not Found response
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Data not found' }),
      };
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  } 
    }