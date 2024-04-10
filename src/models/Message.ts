  export default interface Message {
    id: string;
    receiverId: string;
    chatRoomId: string;
    senderId: string;
    messageContent: string;
    messageType: string;
    readReceipts?: string;
    timestamp: string;
    additionalMetadata?: string;
}