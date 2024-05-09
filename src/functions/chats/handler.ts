import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import messageSchema from './schema/messageSchema';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const createChatHandler : ValidatedEventAPIGatewayProxyEvent<typeof messageSchema> = async (event) => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */

    return formatJSONResponse({
      message: 'Chat created successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Sending message failed',
      error: error.message
    }, 500)
  }
};


const getAllChatsHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */

    return formatJSONResponse({
      message: 'Chat list retrieve successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Chat list retrieve failed',
      error: error.message
    }, 500)
  }
};


const removeChatHandler = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */

    return formatJSONResponse({
      message: 'Chat {id} is removed successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Chat {id} suppression failed',
      error: error.message
    }, 500)
  }
};


export const createChat = middyfy(createChatHandler);
export const getAllChats = middyfy(getAllChatsHandler);
export const removeChat = middyfy(removeChatHandler); 

