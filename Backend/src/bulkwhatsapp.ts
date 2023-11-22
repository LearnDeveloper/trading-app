// // Download the helper library from https://www.twilio.com/docs/node/install
// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
const accountSid = 'AC106d2a3e7b3f856180b56fc94ba997a7';
const authToken = 'a030a7a6c2faaa943f1edc321389740d';
const client = require('twilio')(accountSid, authToken);



const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MwUMUBCrQ8ovo9EE6T0BdVsvKGDTIZ2l81jm0dvizyygzHH4mqJfe436ZL0tUvKTkDYllDNtF2ieF3pHCKEw5bR00nzZCENy8');
export{}



// exports.handler = async (event, context) => {
//     try {
//       const message = await client.messages.create({
//         from: 'whatsapp:+16502274547',
//         body: 'Hi {{1}} Thinking of real estate as an investment? Dubai\'s property market soared with an average appreciation rate of 8% last year! 🚀 Capitalize on this growth with iLand Real Estate\'s free valuation service.Select "YES" to get started.Yes/No',
//         to: 'whatsapp:+917411484910'
//       });
//       console.log(message);
//     } catch (error) {
//       console.error(error);
//     }
//   };

exports.handler = async (event, context) => {
    // let event = "vikas"
    try {
      const message = await client.messages.create({
        from: 'whatsapp:+16502274547',
        body: `Hi VikasGuru Thinking of real estate as an investment? Dubai's property market soared with an average appreciation rate of 8% last year! 🚀 Capitalize on this growth with iLand Real Estate's free valuation service. Select "YES" to get started. Yes/No`,
        to: 'whatsapp:+917411484910'
      });
      console.log(message);
    } catch (error) {
      console.error(error);
    }
  };
  
  

//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*",
//     },
//     body: JSON.stringify(message.sid),
//   };

//   return response;
// };
