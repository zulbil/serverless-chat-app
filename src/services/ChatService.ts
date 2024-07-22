import Chat from "./../models/Chat";
import chatRepository from "./../repositories";

export default class ChatService {

  constructor() {}

  async createChat(chat: Chat): Promise<Chat> {
    return await chatRepository.createChat(chat);
  }

  async getChat(chatId: string): Promise<Chat | null> {
    return chatRepository.getChat(chatId);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return chatRepository.getChatsByUser(userId);
  }

  async updateChat(chat: Chat): Promise<Chat> {
    return chatRepository.updateChat(chat);
  }

  async deleteChat(chatId: string): Promise<void> {
    return chatRepository.deleteChat(chatId);
  }
}
