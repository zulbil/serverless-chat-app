import signupSchema from './schema/signupSchema';
import loginSchema from './schema/loginSchema';
import comfirmUserSchema from './schema/comfirmUserSchema';
import { handlerPath } from '@libs/handler-resolver';

export const signup = {
  handler: `${handlerPath(__dirname)}/handler.signup`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user/signup',
        cors: true,
        request: {
          schemas: {
            'application/json': signupSchema,
          },
        },
      },
    },
  ],
  role: 'LambdaRole'
};


export const login = {
  handler: `${handlerPath(__dirname)}/handler.login`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user/login',
        cors: true,
        request: {
          schemas: {
            'application/json': loginSchema,
          },
        },
      },
    },
  ],
  role: 'LambdaRole'
};


export const verification = {
  handler: `${handlerPath(__dirname)}/handler.verification`,
  events: [
    {
      http: {
        method: 'post',
        path: 'user/verification',
        cors: true,
        request: {
          schemas: {
            'application/json': comfirmUserSchema,
          },
        },
      },
    },
  ],
  role: 'LambdaRole'
};