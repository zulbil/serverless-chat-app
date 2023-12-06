import {
    SignUpCommand,
    CognitoIdentityProviderClient,
    AuthFlowType,
    InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";

const ClientId = process.env.USER_CLIENT_ID;
  
export const signUp = ({ Username, Password, email }) => {
    const client = new CognitoIdentityProviderClient({});
  
    const command = new SignUpCommand({
      ClientId,
      Username,
      Password,
      UserAttributes: [{ Name: "email", Value: email }],
    });
  
    return client.send(command);
};


export const initiateAuth = ({ Username, Password }) => {
    const client = new CognitoIdentityProviderClient({});
  
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: Username,
        PASSWORD: Password,
      },
      ClientId
    });
  
    return client.send(command);
};
  