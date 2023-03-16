import axios from "axios"

const API = axios.create({ baseURL: "http://localhost:3001"})

API.interceptors.request.use( req => {
    if(localStorage.getItem("profile")) {
        const token = JSON.parse(localStorage.getItem("profile")).token;
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
})

export const signIn = (formData) => API.post("/user/signin", formData);

export const signUp = (formData) => API.post("/user/signup", formData);

export const googleLogin = (formData) => API.post("/user/googleLogin", formData);

export const createTour = (updatedFormData) => API.post("/tours/createOrEdit", updatedFormData, {
    headers: { 'Content-Type' : 'multipart/form-data'}
});

export const getTours = (page) => API.get(`/tours?page=${page}`);

export const getTour = (id) => API.get(`/tours/detail/${id}`);

export const getTourToEdit = (id) => API.get(`/tours/createOrEdit/${id}`);

export const getToursByUserApi = (id) => API.get(`/tours/dashboard/${id}`);

export const deleteTourApi = (id) => API.delete(`/tours/dashboard/${id}`);

export const updateTourApi = (id, updatedTourData) => API.patch(`/tours/createOrEdit/${id}`, updatedTourData);

export const searchTourApi = (searchQuery) => API.get(`tours/search?searchQuery=${searchQuery}`);

