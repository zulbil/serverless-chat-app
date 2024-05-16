import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import messageSchema from './schema/messageSchema';

const sendMessageHandler : ValidatedEventAPIGatewayProxyEvent<typeof messageSchema> = async (event) => {
  try {
    
    const userId = event.requestContext?.authorizer?.claims["custom:userId"];
    const chatId = event.pathParameters.chatId;
    const message = event.body.message;
    console.log('UserId :', userId);
    console.log('ChatId :', chatId);
    console.log('Message :', message);

    return formatJSONResponse({
      message: 'Message sent successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Sending message failed',
      error: error.message
    }, 500)
  }
};


export const sendMessage = middyfy(sendMessageHandler);


