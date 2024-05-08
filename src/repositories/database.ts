import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const region        = process.env.REGION || 'us-east-1';

const dynamoDBClient = (): DynamoDBClient => {
  return new DynamoDBClient({ region });
};

export default dynamoDBClient; 

