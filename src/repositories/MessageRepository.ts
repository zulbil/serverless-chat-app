import { 
  DynamoDBClient, 
  PutItemCommand, 
  GetItemCommand, 
  UpdateItemCommand, 
  DeleteItemCommand, 
  QueryCommand,
  ResourceNotFoundException 
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import Message from "../models/Message";

export default class MessageRepository {
  private readonly dynamoDBClient: DynamoDBClient; 
  private readonly tableName: string = process.env.MESSAGES_TABLE;
  private readonly indexName: string = process.env.MESSAGES_CHAT_ID_INDEX;

  constructor(dynamoDBClient: DynamoDBClient) {
    this.dynamoDBClient = dynamoDBClient;
  }

  async createMessage(message: Message): Promise<Message> {
    const params = {
      TableName: this.tableName,
      Item: marshall(message),
    };

    try {
      await this.dynamoDBClient.send(new PutItemCommand(params));
      return message;
    } catch (err) {
      console.error("Error creating message:", err);
      throw err;
    }
  }

  async getMessageById(id: string): Promise<Message | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id }),
    };

    try {
      const { Item } = await this.dynamoDBClient.send(new GetItemCommand(params));
      return Item ? unmarshall(Item) as Message : null;
    } catch (err) {
      if (err instanceof ResourceNotFoundException) {
        console.error(`Message with ID ${id} not found`);
      } else {
        console.error("Error getting message:", err);
      }
      throw err;
    }
  }

  async updateMessage(message: Message): Promise<Message> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id: message.id }),
      UpdateExpression: "set messageText = :messageText, mediaUrls = :mediaUrls, isUpdated = :isUpdated",
      ExpressionAttributeValues: marshall({
        ":messageText": message.messageText,
        ":mediaUrls": message.mediaUrls,
        ":isUpdated": message.isUpdated,
      }),
    };

    try {
      await this.dynamoDBClient.send(new UpdateItemCommand(params));
      return message;
    } catch (err) {
      console.error("Error updating message:", err);
      throw err;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id }),
    };

    try {
      await this.dynamoDBClient.send(new DeleteItemCommand(params));
    } catch (err) {
      console.error("Error deleting message:", err);
      throw err;
    }
  }

  async listMessagesByChatId(chatId: string): Promise<Message[]> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "chatId = :chatId",
      ExpressionAttributeValues: marshall({ ":chatId": chatId }),
    };

    try {
      const { Items } = await this.dynamoDBClient.send(new QueryCommand(params));
      return Items ? Items.map((item) => unmarshall(item) as Message) : [];
    } catch (err) {
      console.error("Error listing messages by chatId:", err);
      throw err;
    }
  }
}
