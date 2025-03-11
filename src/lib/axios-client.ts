import axios from "axios";
import cookie from "js-cookie";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "x-anonymous-id": cookie.get("anonymousId"),
  },
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data } = error.response;

    return Promise.reject({
      ...data,
    });
  },
);
export default API;
