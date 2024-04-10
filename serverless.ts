import type { AWS } from '@serverless/typescript';

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
      MESSAGES_TABLE: 'Messages-${self:provider.stage}',
      CHATROOM_TABLE: 'ChatRooms-${self:provider.stage}',
      CONNECTIONS_TABLE: 'Connections-${self:provider.stage}',
      APP_NAME: 'serverless-chat-app'
    },
  },
  // import the function via paths
  functions: { 
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
      MessagesDynamoDBtable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.MESSAGES_TABLE}",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            },
            {
              AttributeName: "chatRoomId",
              AttributeType: "S"
            }, 
            {
              AttributeName: "timestamp",
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
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "ChatRoomIndex", //alows you to query all messages in a particlura chat room
              KeySchema: [
                {
                  AttributeName: 'chatRoomId',
                  KeyType: 'HASH'
                },
                {
                  AttributeName: "timestamp",
                  KeyType: "RANGE"
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ]
        }
      },
      ChatRoomDynamoDBtable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CHATROOM_TABLE}",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            // {
            //   AttributeName: "chatRoomName",
            //   AttributeType: "S",
            // },
            {
              AttributeName: "memberId",
              AttributeType: "S",
            },
            {
              AttributeName: "createdAt",
              AttributeType: "S",
            }
            // {
            //   AttributeName: "lastMessage",
            //   AttributeType: "S",
            // },
            // {
            //   AttributeName: "chatRoomType",
            //   AttributeType: "S",
            // },
            // {
            //   AttributeName: "additionalInfo",
            //   AttributeType: "S",
            // },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            },
            {
              AttributeName: "createdAt",
              KeyType: "RANGE"
            }
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "MemberIndex",
              KeySchema: [
                {
                  AttributeName: 'memberId',
                  KeyType: 'HASH'
                }
              ],
              Projection: {
                ProjectionType: 'ALL'
              }
            }
          ]
        }
      },
      WebSocketConectionsDynamoDBtable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CONNECTIONS_TABLE}",
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ]
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;
