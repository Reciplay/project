import axios, { AxiosRequestConfig } from "axios"
import { useAuthStore } from "../../stores/authStore"

const chatbotClient = axios.create({
  baseURL: 'api/chatbot/',
  timeout: 10000,
})

export default chatbotClient