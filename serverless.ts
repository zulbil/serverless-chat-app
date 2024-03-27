import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import { signup, login, verification } from '@functions/user'
import { sendMessage } from '@functions/messages'
import { connect, disconnect, defaultMessageHandler } from '@functions/websocket'

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
      websocketApiId: 'chatAppWebsocketApi'
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
    signup,
    login,
    verification,
    sendMessage,
    connect,
    disconnect,
    defaultMessageHandler
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
          ExplicitAuthFlows: ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
        }
      },
      LambdaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'LambdaRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
                Action: 'sts:AssumeRole'
              }
            ]
          },
          Policies: [
            {
              PolicyName: 'LambdaPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "logs:CreateLogGroup",
                      "logs:CreateLogStream",
                      "logs:PutLogEvents"
                    ],
                    Resource: ["arn:aws:logs:*:*:*"]
                  },
                  {
                    Effect: "Allow",
                    Action: [
                      "cognito-idp:AdminInitiateAuth"
                    ],
                    Resource: ["*"]
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
