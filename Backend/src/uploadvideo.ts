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

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI;
let cachedDb = null;




async function createVideoinDB(payload) {
  console.log("payload",payload);
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    // Get a reference to the database and collection
    const db = client.db('trading-app-dev');
    const collection = db.collection('LEARN_MAIN_FEEDS_VIDEO');

    let data :any = {
      "titleEng" : payload.titleEng,
      "subtitleEng" : payload.subtitleEng,
      "videourlEng" : payload.videourlEng,
      "titleIta" : payload.title,
      "subtitleIta" : payload.titleIta,
      "videourlIta" : payload.videourlIta,
      "created_date" : `${currentDay}-${currentMonth}-${currentYear}:${currentHours}:${currentMinutes}:${currentSeconds}`,
    }

    console.log("data",data)
    
    // Insert user data into the collection
    const result = await collection.insertOne(data);

    // Close the MongoDB connection
    client.close();
    console.log(result);
    return {
      statusCode: 200,
      'headers': {
        'Access-Control-Allow-Origin': '*'
    },
      body: JSON.stringify({ message: 'Video Upload successfully', insertedId: result.insertedId }),
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
  let client;
    try {
      // Connect to MongoDB
      client = new MongoClient(MONGODB_URI);
      await client.connect();
    const newUser = await createVideoinDB(body);
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