import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import signupSchema from './schema/signupSchema';
import loginSchema from './schema/loginSchema';
import comfirmUserSchema from './schema/comfirmUserSchema';
import { signUp, initiateAuth, confirmSignUp } from 'src/services/UserAuthService';

const signupHandler : ValidatedEventAPIGatewayProxyEvent<typeof signupSchema> = async (event) => {
  try {
    
    const Username = event.body?.username;
    const Password = event.body?.password;
    const email = event.body?.email;

    console.log('Event Body ', event.body);

    const userSignedUp = await signUp({ Username, Password, email });

    console.log('User Signed Up', userSignedUp);

    return formatJSONResponse({
      message: 'User registered successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Registration failed',
      error: error.message
    }, 500)
  }
};


const loginHandler : ValidatedEventAPIGatewayProxyEvent<typeof loginSchema> = async (event) => {
  try {
    const Username = event.body?.username;
    const Password = event.body?.password;

    const userSignedIn = await initiateAuth({ Username, Password });

    console.log('User Signed In', JSON.stringify(userSignedIn));

    return formatJSONResponse({
      message: 'User logged in successfully ...'
    });

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Authentication failed',
      error: error.message
    }, 404)
  }
};


const userVerificationHandler : ValidatedEventAPIGatewayProxyEvent<typeof comfirmUserSchema> = async (event) => {
  try {
    const username = event.body?.username;
    const code = event.body?.code;

    const comfirm = await confirmSignUp({ username, code });

    console.log('Confirmation Response :', JSON.stringify(comfirm));

    return formatJSONResponse({
      message: 'User verified successfully ...'
    });

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'User verification failed',
      error: error.message
    }, 404)
  }
};

export const signup = middyfy(signupHandler);
export const login = middyfy(loginHandler);
export const verification = middyfy(userVerificationHandler);


