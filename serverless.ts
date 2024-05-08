import type { AWS } from '@serverless/typescript';

import { signup, login, verification } from '@functions/user'
import { sendMessage } from '@functions/messages'

const serverlessConfiguration: AWS = {
  service: 'serverless-chat-app',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION_URL: 'us-east-1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USER_CLIENT_ID: { 'Ref': 'UserClient'},
      USER_POOL_ID: { 'Ref': 'UserPool' },
      CHATMESSAGES_TABLE: 'ChatMessages-${self:provider.stage}',
      CHATS_TABLE: 'Chats-${self:provider.stage}',
      CHATS_INDEX: 'ChatsIndex-${self:provider.stage}',
      CONNECTIONS_TABLE: 'Connections-${self:provider.stage}',
      APP_NAME: 'serverless-chat-app'
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: [
            {
              'Fn::GetAtt': ['ChatMessagesTable', 'Arn']
            },
            {
              'Fn::GetAtt': ['ChatsTable', 'Arn']
            }
          ]
        }],
      },
    }
  },
  // import the function via paths
  functions: { 
    signup,
    login,
    verification,
    sendMessage
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
            },
            {
              Name: 'lastname',
              Required: true,
              Mutable: true
            },
            {
              Name: 'firstname',
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
      },
      ChatsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CHATS_TABLE}",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "participants",
              AttributeType: "S"
            }, 
            {
              AttributeName: "createdAt",
              AttributeType: "S"
            },
            {
              AttributeName: "lastMessage",
              AttributeType: "S"
            },
            {
              AttributeName: "lastMessageTimestamp",
              AttributeType: "S"
            },
            {
              AttributeName: "chatStatus",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },
            {
              AttributeName: "timestamp",
              KeyType: "RANGE"
            }
          ]
        }
      },
      ChatMessagestable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CHATMESSAGES_TABLE}",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: "messageId",
              AttributeType: "S",
            },
            {
              AttributeName: "timestamp",
              AttributeType: "S",
            },
            {
              AttributeName: "chatId",
              AttributeType: "S",
            },
            {
              AttributeName: "senderId",
              AttributeType: "S",
            },
            {
              AttributeName: "messageText",
              AttributeType: "S",
            },
            {
              AttributeName: "mediaUrls",
              AttributeType: "S",
            },
            {
              AttributeName: "isUpdated",
              AttributeType: "S",
            }
          ],
          KeySchema: [
            {
              AttributeName: "messageId",
              KeyType: "HASH"
            },
            {
              AttributeName: "timestamp",
              KeyType: "RANGE"
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "${self:provider.environment.CHATS_INDEX}",
              KeySchema: [
                {
                  AttributeName: 'chatId',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: "timestamp",
                  KeyType: "RANGE"
                }
              ],
              Projection: {
                ProjectionType: 'INCLUDE',
                NonKeyAttributes: ['messageId', 'senderId', 'messageText', 'mediaUrls', 'isUpdated']
              }
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
