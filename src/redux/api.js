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

export const createTour = (updatedFormData) => API.post("/tour/createTour", updatedFormData, {
    headers: { 'Content-Type' : 'multipart/form-data'}
});

