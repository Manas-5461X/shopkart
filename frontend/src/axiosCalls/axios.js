import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // port at which server is running 
    headers: {
        "Content-Type": "application/json", // communication using json format 
    },
    withCredentials: true, // transfer tokens 
})