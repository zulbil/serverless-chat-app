import { 
    DynamoDBClient, 
    PutItemCommand, 
    GetItemCommand, 
    UpdateItemCommand, 
    DeleteItemCommand, 
    QueryCommand,
    ResourceNotFoundException, 
    PutItemCommandInput,
    UpdateItemCommandInput
} from "@aws-sdk/client-dynamodb";
import Chat from "../models/Chat";

export default class ChatRepository {
  private readonly dynamoDBClient: DynamoDBClient;
  private readonly tableName: string = process.env.CHATS_TABLE;

  constructor(dynamoDBClient: DynamoDBClient) {
    this.dynamoDBClient = dynamoDBClient;
  }

  async createChat(chat: Chat): Promise<Chat> {
    const params = {
      TableName: this.tableName,
      Item: {
        id: { S: chat.id },
        participants: { S: chat.participants },
        createdAt: { S: chat.createdAt },
        lastMessage: { S: chat.lastMessage || "" },
        lastMessageTimestamp: { S: chat.lastMessageTimestamp },
        chatStatus: { S: chat.chatStatus || "" },
      },
      ReturnValues: "ALL_OLD", // Return the new item after creation
    } as PutItemCommandInput;
  
    try {
      const data = await this.dynamoDBClient.send(new PutItemCommand(params));
      const status = data['$metadata']['httpStatusCode'];
      if (status !== 200) {
        throw new Error(`Failed to create chat with ID ${chat.id}`);
      }
      return {
        id: chat.id,
        participants: chat.participants,
        createdAt: chat.createdAt,
        lastMessage: chat.lastMessage || undefined,
        lastMessageTimestamp: chat.lastMessageTimestamp,
        chatStatus: chat.chatStatus || undefined,
      } as Chat;
    } catch (err) {
      console.error("Error creating chat:", err);
      throw err; // or handle the error in a different way
    }
  }

  async getChat(chatId: string): Promise<Chat|null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: chatId },
      },
    };

    try {
      const { Item } = await this.dynamoDBClient.send(new GetItemCommand(params));
      if (!Item) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }
      return {
        id: Item.id.S!,
        participants: Item.participants.S!,
        createdAt: Item.createdAt.S!,
        lastMessage: Item.lastMessage.S || undefined,
        lastMessageTimestamp: Item.lastMessageTimestamp.S!,
        chatStatus: Item.chatStatus.S || undefined
      } as Chat;
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        console.error(`Chat with ID ${chatId} not found`);
      } else {
        console.error("Error getting chat:", err);
      }
      throw err; // or handle the error in a different way
    }
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "contains(#participants, :userId)",
    //   ExpressionAttributeNames: {
    //     "#participants": "participants",
    //   },
      ExpressionAttributeValues: {
        ":userId": { S: userId },
      },
      ProjectionExpression: "#id, #participants, #createdAt, #lastMessage, #lastMessageTimestamp, #chatStatus",
      ExpressionAttributeNames: {
        "#id": "id",
        "#participants": "participants",
        "#createdAt": "createdAt",
        "#lastMessage": "lastMessage",
        "#lastMessageTimestamp": "lastMessageTimestamp",
        "#chatStatus": "chatStatus",
      },
    };

    try {
      const { Items } = await this.dynamoDBClient.send(new QueryCommand(params));
      return Items!.map((item) => ({
        id: item.id.S!,
        participants: item.participants.S!,
        createdAt: item.createdAt.S!,
        lastMessage: item.lastMessage.S || undefined,
        lastMessageTimestamp: item.lastMessageTimestamp.S!,
        chatStatus: item.chatStatus.S || undefined,
      })) as Chat[];
    } catch (err) {
      console.error("Error getting user chats:", err);
      throw err;
    }
  }

  async updateChat(chat: Chat): Promise<Chat> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: chat.id },
      },
      UpdateExpression: "set #participants = :participants, #lastMessage = :lastMessage, #lastMessageTimestamp = :lastMessageTimestamp, #chatStatus = :chatStatus",
      ExpressionAttributeNames: {
        "#participants": "participants",
        "#lastMessage": "lastMessage",
        "#lastMessageTimestamp": "lastMessageTimestamp",
        "#chatStatus": "chatStatus",
      },
      ExpressionAttributeValues: {
        ":participants": { S: chat.participants },
        ":lastMessage": { S: chat.lastMessage || "" },
        ":lastMessageTimestamp": { S: chat.lastMessageTimestamp },
        ":chatStatus": { S: chat.chatStatus || "" },
      },
      ReturnValues: "ALL_NEW"
    } as UpdateItemCommandInput;
  
    try {
      const { Attributes } = await this.dynamoDBClient.send(new UpdateItemCommand(params));
      if (!Attributes) {
        throw new Error(`Failed to update chat with ID ${chat.id}`);
      }
      return {
        id: Attributes.id.S!,
        participants: Attributes.participants.S!,
        createdAt: Attributes.createdAt.S!,
        lastMessage: Attributes.lastMessage.S || undefined,
        lastMessageTimestamp: Attributes.lastMessageTimestamp.S!,
        chatStatus: Attributes.chatStatus.S || undefined,
      } as Chat;
    } catch (error) {
      console.error("Error updating chat:", error);
      throw error; // or handle the error in a different way
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: chatId },
      },
    };
    try {
        await this.dynamoDBClient.send(new DeleteItemCommand(params));    
    } catch (error) {
        console.error("Error deleting chat :", error);
        throw error;
    }
  }

}
