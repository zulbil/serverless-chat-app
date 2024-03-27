import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import messageSchema from './schema/messageSchema';

const sendMessageHandler : ValidatedEventAPIGatewayProxyEvent<typeof messageSchema> = async (event) => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */

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


