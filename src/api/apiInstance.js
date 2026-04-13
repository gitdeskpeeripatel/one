import axios from "axios";

export const apiIntance = axios.create({
    baseURL : import.meta.env.VITE_FIREBASE_DATABASE_URL 
})