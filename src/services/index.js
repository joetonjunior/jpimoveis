import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const APIurl = "http://localhost:3000"

export const AXIOS = axios.create({
    baseURL: APIurl
});

export const QUERYCLIENT = new QueryClient();