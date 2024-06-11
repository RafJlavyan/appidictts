import axios, { AxiosInstance } from "axios";
import env from "@/env";

const Axios: AxiosInstance = axios.create({
  baseURL: env.SERVER_URL,
  withCredentials: true,
});

export default Axios;