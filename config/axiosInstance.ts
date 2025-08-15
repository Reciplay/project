import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://i13e104.p.ssafy.io/api/v1",
  withCredentials: true,
});

export default axiosInstance;
