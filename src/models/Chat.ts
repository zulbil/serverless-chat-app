export default interface Chat {
    id: string;
    participants: string;
    createdAt: string;
    lastMessage?: string;
    lastMessageTimestamp: string;
    chatStatus?: string;
    startedBy?:string; 
}