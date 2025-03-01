export interface Comment {
    id: string;
    content: string;
    date: string;
    userId?: string;
    postId?: string;
    replyToComment?: string;
    userName: string;
    userAvatar?: string;
}
