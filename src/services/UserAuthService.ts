import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    AuthFlowType,
    AdminInitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

import { v4 as uuidv4 } from 'uuid';

const ClientId = process.env.USER_CLIENT_ID;
const UserPoolId = process.env.USER_POOL_ID;
  
export const signUp = async ({ Username, Password, email, firstname, lastname }) => {
    try {
      const client = new CognitoIdentityProviderClient({});
      const UserAttributes = [
        { Name: "email", Value: email },
        { Name: "custom:firstname", Value: firstname },
        { Name: "custom:lastname", Value: lastname },
        { Name: "custom:userId", Value: uuidv4() }
      ]; 
      const command = new SignUpCommand({
        ClientId,
        Username,
        Password,
        UserAttributes
      });
      return await client.send(command);
    } catch (error) {
      throw new Error(error.message)
    }
};


export const initiateAuth = async ({ Username, Password }) => {
    try {
      const client = new CognitoIdentityProviderClient({});
  
      const command = new AdminInitiateAuthCommand({
        AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: Username,
          PASSWORD: Password,
        },
        ClientId,
        UserPoolId
      });
      return await client.send(command); 
    } catch (error) {
      throw new Error(error.message);
    }
};




export const confirmSignUp = async ({ username, code }) => {
  try {
    
    const client = new CognitoIdentityProviderClient({});

    const command = new ConfirmSignUpCommand({
      ClientId,
      Username: username,
      ConfirmationCode: code,
    });

    return await client.send(command);
  } catch (error) {
    throw new Error(error.message);
  }
};


  