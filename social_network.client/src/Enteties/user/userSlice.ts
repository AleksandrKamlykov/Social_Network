import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, State } from "@/Enteties/user/types";
import { fetchUser } from "@/Enteties/user/userActionCreator";

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
    userLoading: false,
    birthDate: ""
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state: UserState, action: PayloadAction<IUser>) => {
            Object.keys(action.payload).forEach(key => {
                state[key as keyof IUser] = action.payload[key as keyof IUser];
            });
        },
        removeUser: (state: UserState) => {
            Object.keys(initialState).forEach(key => {
                state[key as keyof IUser] = initialState[key as keyof IUser];
            });
        }

    },
    extraReducers: builder => {
        builder.addCase(fetchUser.fulfilled, (state: UserState, action: PayloadAction<IUser>) => {
            
            Object.keys(action.payload).forEach(key => {
                state[key as keyof IUser] = action.payload[key as keyof IUser];
            });
            state.userLoading = false;
        });
        builder.addCase(fetchUser.pending, (state: UserState) => {
            state.userLoading = true;
        });
        builder.addCase(fetchUser.rejected, (state: UserState) => {
            Object.keys(initialState).forEach(key => {
                state[key as keyof IUser] = initialState[key as keyof IUser];
            });
            state.userLoading = false;
        });
    }
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;