import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import { signupHandler, loginHandler } from '@functions/user'

const serverlessConfiguration: AWS = {
  service: 'serverless-chat-app',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USER_CLIENT_ID: { 'Ref': 'UserClient'},
      USER_POOL_ID: { 'Ref': 'UserPool' }
    },
  },
  // import the function via paths
  functions: { 
    hello,
    signupHandler,
    loginHandler 
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      UserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
          UserPoolName: 'Serverless-Chat',
          Schema: [
            {
              Name: 'email',
              Required: true,
              Mutable: true
            }
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6
            }
          },
          AutoVerifiedAttributes: ["email"]
        }
      },
      UserClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
          ClientName: 'user-pool-ui',
          GenerateSecret: false,
          UserPoolId: { 'Ref': 'UserPool' },
          AccessTokenValidity: 5,
          IdTokenValidity: 5,
          ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH"]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
