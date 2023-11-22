const Stripe = require('stripe');
const stripe = Stripe('sk_test_51MwUMUBCrQ8ovo9EE6T0BdVsvKGDTIZ2l81jm0dvizyygzHH4mqJfe436ZL0tUvKTkDYllDNtF2ieF3pHCKEw5bR00nzZCENy8');
export{}



exports.handler = async (event, context) => {
// const products = await stripe.products.list({
//   limit: 3,
// });

// console.log("products", products);

// const subscriptions = await stripe.subscriptions.list({
//   limit: 3,
// });

// console.log("subscriptions", subscriptions);

// const balance = await stripe.balance.retrieve();

// const payouts = await stripe.payouts.list({
//   limit: 3,
// });


const customers = await stripe.customers.list({
  limit: 1000,
});


// const transfer = await stripe.transfers.create({
//   amount: 400,
//   currency: 'aed',
//   destination: 'acct_1MwUMUBCrQ8ovo9E',
//   transfer_group: 'ORDER_95',
// });

console.log("balance",customers);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(customers),
  };

  return response;
};
