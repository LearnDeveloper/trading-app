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
    getusers: {
      handler: "src/getuser.handler",
      events: [
        {
          http: {
            path: 'getusers',
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
  }

  // import the function via paths
};

module.exports = serverlessConfiguration;
