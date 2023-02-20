import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api  from "../api";

export const login = createAsyncThunk(
    "auth/login",
    async ({ formValue, navigate, toast}, { rejectWithValue}) => {
        try {
            const response = await api.signIn(formValue);
            toast.success("Login Successfully");
            navigate("/");
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async({ formValue, navigate, toast},{ rejectWithValue }) => {
        try {
            const response = await api.signUp(formValue);
            toast.success("Register Successfully");
            navigate("/");
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async({ decodeGoogleToken, navigate, toast},{ rejectWithValue }) => {
        // console.log(formValue);
        try {
            const response = await api.googleLogin(decodeGoogleToken);
            toast.success("Google Login Successfully");
            navigate("/");
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

const initialState = {
    user: null,
    error: "",
    loading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state, action) => {
            localStorage.clear();
            state.user = null;
        }
    },
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
        },
        [register.pending] : (state,action) => {
            state.loading = true
        },
        [register.fulfilled] : (state,action) => {
            state.loading = false;
            localStorage.setItem("profile", JSON.stringify({...action.payload}));
            state.user = action.payload;
        },
        [register.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [googleLogin.pending] : (state,action) => {
            state.loading = true
        },
        [googleLogin.fulfilled] : (state,action) => {
            state.loading = false;
            localStorage.setItem("profile", JSON.stringify({...action.payload}));
            state.user = action.payload;
        },
        [googleLogin.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
    }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer