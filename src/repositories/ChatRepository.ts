import { 
    DynamoDBClient, 
    PutItemCommand, 
    GetItemCommand, 
    UpdateItemCommand, 
    DeleteItemCommand, 
    DeleteItemCommandInput,
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

  async getChat(chatId: string): Promise<Chat | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: chatId },
      },
    };
  
    try {
      const data = await this.dynamoDBClient.send(new GetItemCommand(params));
      const status = data['$metadata']['httpStatusCode'];
      if (status !== 200) {
        throw new Error(`Failed to get chat with ID ${chatId}`);
      }
      return data.Item ? {
        id: data.Item.id.S!,
        participants: data.Item.participants.S!,
        createdAt: data.Item.createdAt.S!,
        lastMessage: data.Item.lastMessage.S || undefined,
        lastMessageTimestamp: data.Item.lastMessageTimestamp.S!,
        chatStatus: data.Item.chatStatus.S || undefined,
      } as Chat : null;
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        return null;
      }
      console.error("Error getting chat:", err);
      throw err;
    }
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const params = {
      TableName: this.tableName, 
      FilterExpression: "contains(#participants, :userId)",
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
      const data = await this.dynamoDBClient.send(new QueryCommand(params));
      const status = data['$metadata']['httpStatusCode'];
      if (status !== 200) {
        throw new Error(`Failed to get user chats with ID ${userId}`);
      }
      return data?.Items!.map((item) => ({
        id: item.id.S!,
        participants: item.participants.S!,
        createdAt: item.createdAt.S!,
        lastMessage: item.lastMessage.S || undefined,
        lastMessageTimestamp: item.lastMessageTimestamp.S!,
        chatStatus: item.chatStatus.S || undefined,
      })) as Chat[];
    } catch (err) {
      console.error("Error getting user chats:", err);
      throw err
    }
  }

async updateChat(chat: Chat): Promise<Chat> {
    const params: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: {
        id: { S: chat.id },
      },
      UpdateExpression: "SET #participants = :participants, #lastMessage = :lastMessage, #lastMessageTimestamp = :lastMessageTimestamp, #chatStatus = :chatStatus",
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
      ReturnValues: "ALL_NEW",
    };
  
    try {
      const data = await this.dynamoDBClient.send(new UpdateItemCommand(params));
      const status: number = data['$metadata']['httpStatusCode'];
      if (status !== 200) {
        throw new Error(`Failed to update chat with ID ${chat.id}`);
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
      console.error("Error updating chat:", err);
      throw err;
    } 
}

  async deleteChat(chatId: string): Promise<void> {
    const params: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: {
        id: { S: chatId },
      },
    };
  
    try {
      const data = await this.dynamoDBClient.send(new DeleteItemCommand(params));
      const status: number = data['$metadata']['httpStatusCode'];
      if (status !== 200) {
        throw new Error(`Failed to delete chat with ID ${chatId}`);
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      throw err;
    }
  }

}