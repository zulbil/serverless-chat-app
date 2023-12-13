import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'user/hello',
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
};
