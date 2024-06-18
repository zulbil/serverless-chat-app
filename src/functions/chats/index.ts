import createChatSchema from './schema/createChatSchema';
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
            'application/json': createChatSchema,
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

export const getChat = {
  handler: `${handlerPath(__dirname)}/handler.getChat`,
  events: [
    {
      http: {
        method: 'GET',
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

export const updateChat = {
  handler: `${handlerPath(__dirname)}/handler.updateChat`,
  events: [
    {
      http: {
        method: 'PUT',
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