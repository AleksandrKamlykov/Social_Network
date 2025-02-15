import { Roles } from "@/Shared/models/roles";

export enum State {
    Active = "active",
    Inactive = "inactive"
}

export interface Picture {
    // Define the properties of Picture
}

export interface Post {
    // Define the properties of Post
}

export interface Comment {
    // Define the properties of Comment
}

export interface Message {
    // Define the properties of Message
}

export interface Chat {
    // Define the properties of Chat
}

export interface IUser {
    id: string;
    state: State;
    name: string;
    nickname: string;
    email: string;
    password: string;
    roles: Roles[];
    avatar?: Picture;
    bio?: string;
    pictures?: Picture[];
    posts?: Post[];
    comments?: Comment[];
    messages?: Message[];
    chats?: Chat[];
    friends?: IUser[];
    createdAt?: string;
    birthDate: string;
}