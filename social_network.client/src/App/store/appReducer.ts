import { combineReducers } from "@reduxjs/toolkit";
import {userSlice} from "@/Enteties/user/userSlice.ts";


export const rootReducer = combineReducers({
    user: userSlice.reducer,
});