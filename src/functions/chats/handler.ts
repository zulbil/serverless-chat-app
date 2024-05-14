import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import createChatSchema from './schema/createChatSchema';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { chatService } from 'src/services';
import { v4 as uuidv4 } from 'uuid';
import Chat from 'src/models/Chat';

const createChatHandler : ValidatedEventAPIGatewayProxyEvent<typeof createChatSchema> = async (event) => {
  try {

    const userId = event.requestContext?.authorizer?.claims["custom:userId"];
    const newChat = {
      id: uuidv4(),
      participants: JSON.stringify(event.body.participants || []),
      createdAt: new Date().toISOString(),
      chatStatus: 'ACTIVE',
      lastMessage: '',
      lastMessageTimestamp: new Date().toISOString(),
      startedBy: userId
    } as Chat

    const createChat = await chatService.createChat(newChat);

    return formatJSONResponse({
      message: 'Chat created successfully...',
      chat: createChat
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
    const id = event.pathParameters.id;
    const updatedChat = {...event.body, id } as Chat; 
    const chat = await chatService.updateChat(updatedChat);

    return formatJSONResponse({
      message: 'Chat updated successfully...',
      chat
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
    const userId = event.requestContext?.authorizer?.claims["custom:userId"]; 
    const chats = await chatService.getUserChats(userId);
    return formatJSONResponse({
      message: 'Chat list retrieve successfully...',
      autorizer: event.requestContext.authorizer,
      chats
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

    await chatService.deleteChat(event.pathParameters.id);

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
