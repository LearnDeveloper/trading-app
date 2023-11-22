import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'trading-api',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      MONGODB_URI: 'mongodb+srv://learn-admin:learn-admin@trading-app-dev.ilaxkyy.mongodb.net/?retryWrites=true&w=majority'
    },
    lambdaHashingVersion: '20201221',
  },
  functions: {
    createuser: {
      handler: "src/createUser.handler",
      events: [
        {
          http: {
            path: 'createuser',
            method: 'post',
            cors: true,
          },

        }]
    },
    login: {
      handler: "src/login.handler",
      events: [
        {
          http: {
            path: 'login',
            method: 'post',
            cors: true,
          },

        }]
    },
    payouts: {
      handler: "src/payouts.handler",
      events: [
        {
          http: {
            path: 'payouts',
            method: 'post',
            cors: true,
          },

        }]
    },
    getusers: {
      handler: "src/getuser.handler",
      events: [
        {
          http: {
            path: 'getAllusers',
            method: 'post',
            cors: true,
          },

        }]
    },
    verifyotp: {
      handler: "src/verifyotp.handler",
      events: [
        {
          http: {
            path: 'verifyotp',
            method: 'post',
            cors: true,
          },

        }]
    },
    resend: {
      handler: "src/resend.handler",
      events: [
        {
          http: {
            path: 'resend',
            method: 'post',
            cors: true,
          },

        }]
    },
    stripe: {
      handler: "src/stripe.handler",
      events: [
        {
          http: {
            path: 'stripeNew',
            method: 'post',
            cors: true,
          },

        }]
    },  
    createposition: {
      handler: "src/createPositions.handler",
      events: [
        {
          http: {
            path: 'createposition',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    getposition: {
      handler: "src/getpositions.handler",
      events: [
        {
          http: {
            path: 'getposition',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    uploadvideos: {
      handler: "src/uploadvideo.handler",
      events: [
        {
          http: {
            path: 'uploadvideo',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    getvideos: {
      handler: "src/getvideos.handler",
      events: [
        {
          http: {
            path: 'getvideo',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    editprofile: {
      handler: "src/editprofile.handler",
      events: [
        {
          http: {
            path: 'editprofile',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    notifications: {
      handler: "src/notifications.handler",
      events: [
        {
          http: {
            path: 'sendnotifications',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    fevourdk: {
      handler: "src/fevourdk.handler",
      events: [
        {
          http: {
            path: 'fevourdk',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    getFevourdk: {
      handler: "src/getFevourdk.handler",
      events: [
        {
          http: {
            path: 'getFevourdk',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    editprofileadmin: {
      handler: "src/editprofileadmin.handler",
      events: [
        {
          http: {
            path: 'editprofileadmin',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    editpositions: {
      handler: "src/editpositions.handler",
      events: [
        {
          http: {
            path: 'editpositions',
            method: 'post',
            cors: true,
          },

        }]
    }, 
    stripegetpayments: {
      handler: "src/stripegetpayments.handler",
      events: [
        {
          http: {
            path: 'stripegetpaymentsNew',
            method: 'post',
            cors: true,
          },

        }]
    },
    pushnotificationtoken: {
      handler: "src/pushnotificationtoken.handler",
      events: [
        {
          http: {
            path: 'pushnotificationtoken',
            method: 'post',
            cors: true,
          },

        }]
    },
    deleteaccount: {
      handler: "src/deleteaccount.handler",
      events: [
        {
          http: {
            path: 'deleteaccount',
            method: 'post',
            cors: true,
          },

        }]
    },
    updatepayment: {
      handler: "src/updatepayment.handler",
      events: [
        {
          http: {
            path: 'updatepayment',
            method: 'post',
            cors: true,
          },

        }]
    },
    updatenotificationtoken: {
      handler: "src/updatenotificationtoken.handler",
      events: [
        {
          http: {
            path: 'updatenotificationtoken',
            method: 'post',
            cors: true,
          },

        }]
    },
    updatelikes: {
      handler: "src/updatelikes.handler",
      events: [
        {
          http: {
            path: 'updatelikes',
            method: 'post',
            cors: true,
          },

        }]
    },
    getlikesbyuserid :{
      handler: "src/getlikesbyuserid.handler",
      events: [
        {
          http: {
            path: 'getlikesbyuserid',
            method: 'post',
            cors: true,
          },

        }]
    },
    updatevideoview :{
      handler: "src/updatevideoview.handler",
      events: [
        {
          http: {
            path: 'updatevideoview',
            method: 'post',
            cors: true,
          },

        }]
    },
    getreferreddetails :{
      handler: "src/getreferreddetails.handler",
      events: [
        {
          http: {
            path: 'getreferreddetails',
            method: 'post',
            cors: true,
          },

        }]
    },
    forgotpassword :{
      handler: "src/forgotpassword.handler",
      events: [
        {
          http: {
            path: 'forgotpassword',
            method: 'post',
            cors: true,
          },

        }]
    },
    voterSlipGenerator :{
      handler: "src/voterSlipGenerator.handler",
      events: [
        {
          http: {
            path: 'voterSlipGenerator',
            method: 'post',
            cors: true,
          },

        }]
    },
    voterSlipDirectPDF :{
      handler: "src/voterSlipDirectPDF.handler",
      events: [
        {
          http: {
            path: 'voterSlipGenerator',
            method: 'post',
            cors: true,
          },

        }]
    },
    bulkwhatsapp :{
      handler: "src/bulkwhatsapp.handler",
      events: [
        {
          http: {
            path: 'bulkwhatsapp',
            method: 'post',
            cors: true,
          },

        }]
    },
    getUniqueData :{
      handler: "src/getUniqueData.handler",
      events: [
        {
          http: {
            path: 'getUniqueData',
            method: 'post',
            cors: true,
          },

        }]
    },
    


    
  }

  // import the function via paths
};

module.exports = serverlessConfiguration;
