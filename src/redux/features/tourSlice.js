import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api  from "../api";

export const createTour = createAsyncThunk(
    "tours/create",
    async ({ updatedTourData, navigate, toast}, { rejectWithValue}) => {
        try {
            const { title, description, imageFile, tags} = updatedTourData;

             // create form data and append fields
             const updatedFormData = new FormData();
             updatedFormData.append("title", title);
             updatedFormData.append("description", description);
             updatedFormData.append("tags", tags);
             updatedFormData.append("image", imageFile);

            //  for (var pair of updatedFormData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }

            const response = await api.createTour(updatedFormData);
            // console.log(response);
            toast.success("Create Tour Post Successfully");
            navigate("/");
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const getTours = createAsyncThunk(
    "tours/getTours",
    async (_, { rejectWithValue}) => {
        try {
            const response = await api.getTours();
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

const initialState = {
    tour: {},
    tours: [],
    userTour: {},
    error: "",
    loading: false
};

export const tourSlice = createSlice({
    name: 'tour',
    initialState,
    extraReducers: {
        [createTour.pending] : (state, action) => {
            state.loading = true
        },
        [createTour.fulfilled] : (state,action) => {
            state.loading = false;
            state.tours = [action.payload];
        },
        [createTour.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
        [getTours.pending] : (state, action) => {
            state.loading = true
        },
        [getTours.fulfilled] : (state,action) => {
            state.loading = false;
            state.tours = action.payload;
        },
        [getTours.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
    }
});

export default tourSlice.reducer