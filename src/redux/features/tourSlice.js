import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import * as api  from "../api";

export const createTour = createAsyncThunk(
    "tours/create",
    async ({ tocreateTour, navigate, toast}, { rejectWithValue}) => {
        // console.log(tocreateTour);
        try {
            const { title, description, imageFile, tags, imageType, name, imageName, userId } = tocreateTour;

             // create form data and append fields
             const updatedFormData = new FormData();
             updatedFormData.append("title", title);
             updatedFormData.append("description", description);
             updatedFormData.append("name", name);
             updatedFormData.append("tags", tags);
             if(imageFile) {
                updatedFormData.append("image", imageFile);
                updatedFormData.append("imageType", imageType);
                updatedFormData.append("imageName", imageName);
            }
            updatedFormData.append("userId", userId)


            const response = await api.createTour(updatedFormData);
            // console.log(response);
            toast.success("Create Post Successfully");
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
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const getTour = createAsyncThunk(
    "tours/getTour",
    async (id, { rejectWithValue}) => {
        try {
            const response = await api.getTour(id);
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const getToursByUser = createAsyncThunk(
    "tours/getToursByUser",
    async (userId, { rejectWithValue}) => {
        try {
            const response = await api.getToursByUserApi(userId);
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const deleteTour = createAsyncThunk(
    "tours/deleteTour",
    async ({ id, toast }, { rejectWithValue}) => {
        try {
            const response = await api.deleteTourApi(id); 
            toast.success("Deleted Successfully");
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const updateTour = createAsyncThunk(
    "tours/updateTour",
    async ({ toUpdateTour, navigate, toast, id }, { rejectWithValue}) => {

        console.log("update", toUpdateTour);
        try {
            const { title, description, imageFile, tags, imageType, name, imageName } = toUpdateTour;

             // create form data and append fields
             const updatedFormData = new FormData();
             updatedFormData.append("title", title);
             updatedFormData.append("description", description);
             updatedFormData.append("name", name);
             updatedFormData.append("tags", tags);
             updatedFormData.append("image", imageFile);
             updatedFormData.append("imageType", imageType);
             updatedFormData.append("imageName", imageName);

            const response = await api.updateTourApi(id, updatedFormData); 
            toast.success("Updated Successfully");
            navigate("/");
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);

export const getToursBySearch = createAsyncThunk(
    "tours/getToursBySearch",
    async (search, { rejectWithValue}) => {
        try {
            const response = await api.searchTourApi(search);
            // console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    }
);



const initialState = {
    tour: {},
    tours: [],
    userTour: [],
    error: "",
    loading: false
};

export const tourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
        // create :(state,action) => {
        //    console.log(action.payload);
        //    state.tours = [...state.tours, action.payload];
        // }
    },
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
        [getTour.pending] : (state, action) => {
            state.loading = true
        },
        [getTour.fulfilled] : (state,action) => {
            state.loading = false;
            state.tour = action.payload;
        },
        [getTour.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
        [getToursByUser.pending] : (state, action) => {
            state.loading = true
        },
        [getToursByUser.fulfilled] : (state,action) => {
            state.loading = false;
            state.userTour = [action.payload];
        },
        [getToursByUser.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
        [deleteTour.pending] : (state, action) => {
            state.loading = true
        },
        [deleteTour.fulfilled] : (state,action) => {
            state.loading = false;
            console.log("action" , action)
            const { arg : {id} } = action.meta;
            if(id) {
              state.userTour = state.userTour.filter(tour => tour._id !== id );
              state.tours = state.tours.filter(tour => tour._id !== id );
            }
        },
        [deleteTour.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
        [updateTour.pending] : (state, action) => {
            state.loading = true
        },
        [updateTour.fulfilled] : (state,action) => {
            state.loading = false;
            // console.log("action" , action)
            const { arg : {id} } = action.meta;
            if(id) {
              state.userTour = state.userTour.map(tour => tour._id === id ? action.payload : tour );
              state.tours = state.tours.filter(tour => tour._id === id ? action.payload : tour );
            }
        },
        [updateTour.rejected] : (state,action) => {
            state.loading = false;
            state.error = action.payload?.message;
        },
    }
});

// export const { create } = tourSlice.actions
export default tourSlice.reducer