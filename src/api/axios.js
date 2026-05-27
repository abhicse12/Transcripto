import axios from "axios"

const API = axios.create({

  baseURL:
    "https://transcripto-backend-h9e7.onrender.com/api",
})

export default API