import messageSchema from './schema/messageSchema';
import { handlerPath } from '@libs/handler-resolver';

export const sendMessage = {
  handler: `${handlerPath(__dirname)}/handler.sendMessage`,
  events: [
    {
      http: {
        method: 'post',
        path: 'messages',
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