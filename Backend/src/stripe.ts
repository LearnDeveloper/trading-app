const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MwUMUBCrQ8ovo9EE6T0BdVsvKGDTIZ2l81jm0dvizyygzHH4mqJfe436ZL0tUvKTkDYllDNtF2ieF3pHCKEw5bR00nzZCENy8');
export{}



exports.handler = async (event, context) => {


const balance = await stripe.balance.retrieve();
const payouts = await stripe.payouts.list({
    limit: 3,
  });
  console.log("payouts",payouts);
//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*",
//     },
//     body: JSON.stringify(balance),
//   };

  return response;
};
