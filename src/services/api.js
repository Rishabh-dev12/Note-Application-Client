import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);