import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    AuthFlowType,
    AdminInitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

const ClientId = process.env.USER_CLIENT_ID;
const UserPoolId = process.env.USER_POOL_ID;
  
export const signUp = async ({ Username, Password, email, firstname, lastname }) => {
    try {
      const client = new CognitoIdentityProviderClient({});
      const UserAttributes = [
        { Name: "email", Value: email },
        { Name: "firstname", Value: firstname },
        { Name: "lastname", Value: lastname },
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


  