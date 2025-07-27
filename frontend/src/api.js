// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://pets-project-1.onrender.com", // Backend URL
});

export default API;
