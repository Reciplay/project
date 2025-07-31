import axios from 'axios'

const chatbotClient = axios.create({
  baseURL: 'api/chatbot/',
  timeout: 10000,
})

export default chatbotClient