import messageSchema from './schema/messageSchema';
import { handlerPath } from '@libs/handler-resolver';

export const addChat = {
  handler: `${handlerPath(__dirname)}/handler.createChat`,
  events: [
    {
      http: {
        method: 'POST',
        path: 'chats',
        cors: true,
        request: {
          schemas: {
            'application/json': messageSchema,
          },
        },
        authorizer: {
          name: 'PrivateAuthorizer',
          type: 'COGNITO_USER_POOLS',
          arn: {
            'Fn::GetAtt': ['UserPool', 'Arn']
          },
          claims: ["email"]
        }
      },
    },
  ],
  role: 'LambdaRole'
};


export const getAllChats = {
  handler: `${handlerPath(__dirname)}/handler.getAllChats`,
  events: [
    {
      http: {
        method: 'GET',
        path: 'chats',
        cors: true,
        authorizer: {
          name: 'PrivateAuthorizer',
          type: 'COGNITO_USER_POOLS',
          arn: {
            'Fn::GetAtt': ['UserPool', 'Arn']
          },
          claims: ["email"]
        }
      },
    },
  ],
  role: 'LambdaRole'
};


export const removeChat = {
  handler: `${handlerPath(__dirname)}/handler.removeChat`,
  events: [
    {
      http: {
        method: 'DELETE',
        path: 'chats/{chatId}',
        cors: true,
        authorizer: {
          name: 'PrivateAuthorizer',
          type: 'COGNITO_USER_POOLS',
          arn: {
            'Fn::GetAtt': ['UserPool', 'Arn']
          },
          claims: ["email"]
        }
      },
    },
  ],
  role: 'LambdaRole'
};