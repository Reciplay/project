import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://i13e104.p.ssafy.io:8080",
  withCredentials: true,
});

export default axiosInstance;
