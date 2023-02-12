import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api  from "../api";

export const login = createAsyncThunk(
    "auth/login",
    async ({ formValue, navigate, toast}, { rejectWithValue}) => {
        try {
            const response = await api.signIn(formValue);
            toast.success("Signin Successfully");
            navigate("/");
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async({}) => {
        try {
            
        } catch (error) {
            
        }
    }
)

const initialState = {
    user: null,
    error: "",
    loading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        [login.pending] : (state,action) => {
            state.loading = true
        },
        [login.fulfilled] : (state,action) => {
            state.loading = false;
            localStorage.setItem("profile", JSON.stringify({...action.payload}));
            state.user = action.payload;
        },
        [login.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload.message;
        }
    }
})

export default authSlice.reducer