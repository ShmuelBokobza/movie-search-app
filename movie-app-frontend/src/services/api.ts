import axios, { AxiosResponse } from "axios";
import { Movie, SearchParams } from "../types";

const API_URL = "http://localhost:5001/api";

interface LoginResponse {
  token: string;
}

type SearchMoviesResponse = Movie[];

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (credentials: {
  username: string;
  password: string;
}): Promise<AxiosResponse<LoginResponse>> => {
  return apiClient.post<LoginResponse>("/login", credentials);
};

export const searchMovies = (
  params: SearchParams
): Promise<AxiosResponse<SearchMoviesResponse>> => {
  return apiClient.get<SearchMoviesResponse>("/movies/search", { params });
};

export default apiClient;
