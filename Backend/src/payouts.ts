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
 
const finalCustomerData = customers.data;

let getCustomerID = await finalCustomerData.filter(x =>x.email = "vikasguru@c360soft.ai")[0].id
console.log("getCustomerId", getCustomerID);


// const paymentLinks = await stripe.paymentLinks.list({
//   limit: 3,
// });

// console.log("payment Link", paymentLinks.data[0].subscription_data);

// const transfer = await stripe.transfers.create({
//   amount: 6,
//   currency: 'usd',
//   destination: getCustomerID,
//   transfer_group: 'Learn_Subscription',
// });

const transfer = await stripe.transfers.create({
  amount: 6,
  currency: 'usd',
  destination: 'acct_1MwUMUBCrQ8ovo9E',
  transfer_group: 'ORDER_95',
});

// const bankAccounts = await stripe.accounts.listExternalAccounts(
//     getCustomerID,
//   {object: 'bank_account', limit: 3}
// );

// const payout = await stripe.payouts.create({
//   amount: 6,
//   currency: 'usd',
//   destination: getCustomerID,

// });
console.log("payout", transfer);

// const transfer = await stripe.transfers.create({
//   aclmount: 400,
//   currency: 'aed',
//   destination: 'acct_1MwUMUBCrQ8ovo9E',
//   transfer_group: 'ORDER_95',
// });

//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Headers": "*",
//     },
//     body: transfer,
//   };

//   return response;
};
