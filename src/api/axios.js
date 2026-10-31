import axios from "axios"

const API = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000/api"
      : "https://transcripto-backend-h9e7.onrender.com/api"),
})

export default API