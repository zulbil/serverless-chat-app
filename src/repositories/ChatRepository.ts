import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";

export default class ChatRepository {
  private readonly dynamoDBClient: DynamoDBClient;
  private readonly tableName: string = process.env.CHATS_TABLE;

  constructor(dynamoDBClient: DynamoDBClient) {
    this.dynamoDBClient = dynamoDBClient;
  }

  async createChat(chat: any): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: chat,
    };

    try {
      await this.dynamoDBClient.send(new PutItemCommand(params));
    } catch (err) {
      console.error("Error creating chat:", err);
      throw err; // or handle the error in a different way
    }
  }

  async getChat(chatId: string): Promise<any> {
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
      return Item;
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        console.error(`Chat with ID ${chatId} not found`);
      } else {
        console.error("Error getting chat:", err);
      }
      throw err; // or handle the error in a different way
    }
  }

  async updateChat(chat: any): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: { S: chat.id },
      },
      UpdateExpression: "set #msg = :msg, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#msg": "message",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":msg": { S: chat.message },
        ":updatedAt": { N: `${Date.now()}` },
      },
    };
    try {
        await this.dynamoDBClient.send(new UpdateItemCommand(params));    
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
