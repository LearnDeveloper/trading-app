// import { Handler } from 'aws-lambda';
var admin = require("firebase-admin");

// export{}

const serviceAccount = require('./serviceAccountKey.json'); // Replace with your service account key

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

// export const getTokens: Handler = async (event, context) => {
//   try {
//     const tokensRef = admin.database().ref('device_tokens'); // Update the reference path as needed

//     const snapshot = await tokensRef.once('value');
//     const tokens: string[] = [];

//     snapshot.forEach(childSnapshot => {
//       const token = childSnapshot.val();
//       tokens.push(token);
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify(tokens),
//     };
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Failed to fetch tokens' }),
//     };
//   }
// };


import axios from "axios";

export{}

exports.handler = async (event, context) => {

  try {
    const tokensRef = admin.database().ref('device_tokens'); // Update the reference path as needed

    const snapshot = await tokensRef.once('value');
    const tokens: string[] = [];

    snapshot.forEach(childSnapshot => {
      const token = childSnapshot.val();
      tokens.push(token);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch tokens' }),
    };
  }

//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*",
//     },
//     body: JSON.stringify(userDetails),
//   };

//   return response;
};
