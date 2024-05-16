import Message from "../models/Message";
import messageRepository from "../repositories";

export default class MessageService {

  constructor() {}

  async createMessage(message: Message): Promise<Message> {
    //return await chatRepository.createChat(chat);
  }

  async getMessage(messageId: string): Promise<Message | null> {
    //return chatRepository.getChat(messageId);
  }

  async getMessages(userId: string): Promise<Message[]> {
    //return chatRepository.getUserChats(userId);
  }

  async updateMessage(message: Message): Promise<Message> {
    //return chatRepository.updateChat(chat);
  }

  async deleteMessage(messageId: string): Promise<void> {
    //return chatRepository.deleteChat(chatId);
  }
}
