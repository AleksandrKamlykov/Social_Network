export interface Post {
    id: string;
    content: string;
    date: string;
    userId?: string;
    comments?: Comment[];
    likes: number;
}