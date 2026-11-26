import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

//export const APIurl = "http://localhost:3000"
export const APIurl = "https://tetos-api-s1iy.onrender.com"

export const AXIOS = axios.create({
    baseURL: APIurl
});

export const QUERYCLIENT = new QueryClient();