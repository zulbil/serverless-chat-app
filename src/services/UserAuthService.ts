import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    AuthFlowType,
    InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

const ClientId = process.env.USER_CLIENT_ID;
  
export const signUp = async ({ Username, Password, email }) => {
    try {
      const client = new CognitoIdentityProviderClient({});
  
      const command = new SignUpCommand({
        ClientId,
        Username,
        Password,
        UserAttributes: [{ Name: "email", Value: email }],
      });
      return await client.send(command);
    } catch (error) {
      throw new Error(error.message)
    }
};


export const initiateAuth = async ({ Username, Password }) => {
    try {
      const client = new CognitoIdentityProviderClient({});
  
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: Username,
          PASSWORD: Password,
        },
        ClientId
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


  