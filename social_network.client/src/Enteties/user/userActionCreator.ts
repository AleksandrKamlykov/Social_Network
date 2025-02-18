import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {Roles} from "@/Shared/models/roles.ts";
import {  IUser, State } from "@/Enteties/user/types.ts";

export const fetchUser = createAsyncThunk<IUser>(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("https://localhost:7075/api/User/whoami",{withCredentials:true});
            return response.data;
        } catch (error) {
            console.error('API error:', error);
            return rejectWithValue(error.response.data);
        }
    }
);