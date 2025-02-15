import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, State } from "@/Enteties/user/types.ts";
import { fetchUser } from "@/Enteties/user/userActionCreator.ts";

interface UserState extends IUser {
    userLoading: boolean;
}

const initialState: UserState = {
    id: "",
    state: State.Inactive,
    name: "",
    nickname: "",
    email: "",
    password: "",
    roles: [],
    userLoading: false
   
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},

    extraReducers: builder => {
        builder.addCase(
            fetchUser.fulfilled.type,
            (state: UserState, action: PayloadAction<IUser>) => {
                Object.keys(action.payload).forEach(key => {
                    state[key as keyof IUser] = action.payload[key as keyof IUser];
                });
                state.userLoading = false;
            }
        );

        builder.addCase(fetchUser.pending.type, (state: UserState) => {
            state.userLoading = true;
        });

        builder.addCase(fetchUser.rejected.type, (state: UserState) => {
           Object.keys(initialState).forEach(key => {
               state[key as keyof IUser] = initialState[key as keyof IUser];
           });
        });
    }
});