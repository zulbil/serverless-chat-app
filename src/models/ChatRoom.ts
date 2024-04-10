export default interface ChatRoom {
    id: string;
    chatRoomName: string;
    memberId: string;
    createdAt: string;
    lastMessage: string;
    chatRoomType: string;
    additionalInfo: string;
}