  export default interface Message {
    messageId: string;
    timestamp: string;
    chatId: string;
    senderId?: string;
    messageText?: string;
    mediaUrls?: string[];
    isUpdated?: boolean;
}