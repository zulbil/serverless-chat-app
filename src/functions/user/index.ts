import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const signupHandler = {
  handler: `${handlerPath(__dirname)}/handler.signup`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user/signup',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};


export const loginHandler = {
  handler: `${handlerPath(__dirname)}/handler.login`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user/signin',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};