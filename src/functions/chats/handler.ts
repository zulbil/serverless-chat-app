import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createChatSchema from './schema/createChatSchema';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { chatService } from 'src/services';
import { v4 as uuidv4 } from 'uuid';

const createChatHandler : ValidatedEventAPIGatewayProxyEvent<typeof createChatSchema> = async (event) => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */
    // const newChat = {
    //   id: uuidv4(),
    //   ...event.body
    // }

    return formatJSONResponse({
      message: 'Chat created successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Creating chat failed',
      error: error.message
    }, 500)
  }
};

const updateChatHandler : ValidatedEventAPIGatewayProxyEvent<typeof createChatSchema> = async (event) => {
  try {
    
    /**
     * @Todo Store message in DynamoDB, and use SNS or Websocket to notify the receiver
     * 
     */

    return formatJSONResponse({
      message: 'Chat updated successfully...'
    }, 201);

  } catch (error) {
    console.log('Error occured :',error.message);
    return formatJSONResponse({
      message: 'Update chat failed',
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
      message: 'Chat list retrieve successfully...',
      autorizer: event.requestContext.authorizer
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


export const createChat     = middyfy(createChatHandler);
export const getAllChats    = middyfy(getAllChatsHandler);
export const removeChat     = middyfy(removeChatHandler); 
export const updateChat     = middyfy(updateChatHandler);
