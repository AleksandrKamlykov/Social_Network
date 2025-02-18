import { Roles } from "@/Shared/models/roles";

export enum State {
  Active = "active",
  Inactive = "inactive",
}

export interface Picture {
  // Define the properties of Picture
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

  friends?: IUser[];
  createdAt?: string;
  birthDate: string;
}
