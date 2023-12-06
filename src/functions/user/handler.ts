import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { signUp, initiateAuth } from 'src/services/UserAuthService';

const signupHandler : ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    
    const Username = event.body?.username;
    const Password = event.body?.password;
    const email = event.body?.email;

    const userSignedUp = signUp({ Username, Password, email });

    console.log('User Signed Up', JSON.stringify(userSignedUp));

    return formatJSONResponse({
      body: JSON.stringify(userSignedUp)
    });

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'An error just occured...',
      error: error.message
    }, 404)
  }
};


const loginHandler : ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const Username = event.body?.username;
    const Password = event.body?.password;

    const userSignedIn = initiateAuth({ Username, Password });

    console.log('User Signed In', JSON.stringify(userSignedIn));

    return formatJSONResponse({
      body: JSON.stringify(userSignedIn)
    });

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'An error just occured...',
      error: error.message
    }, 404)
  }
};

export const signup = middyfy(signupHandler);
export const login = middyfy(loginHandler);


