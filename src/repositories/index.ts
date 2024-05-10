import dynamoDBClient from "./database";
import ChatRepository from "./ChatRepository";

const chatRepository = new ChatRepository(dynamoDBClient());
export default chatRepository;