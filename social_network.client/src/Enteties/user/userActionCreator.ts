import { createAsyncThunk } from "@reduxjs/toolkit";
import {Roles} from "@/Shared/models/roles.ts";
import {  IUser, State } from "@/Enteties/user/types.ts";

export const fetchUser = createAsyncThunk(
    "user/fetchAll",
    async (_, thunkAPI) => {
        try {
            const response: IUser = {
                nickname: "CC181194Kan",
                roles: [Roles.Admin],
                id: "1",
                state: State.Active,
                name: "Kan",
                email: "alex@email.com",
                password: "123456",
            };
            return response;
        } catch (e) {
            return thunkAPI.rejectWithValue(
                "Не удалось загрузить пользователей"
            );
        }
    }
);