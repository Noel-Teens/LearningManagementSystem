import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000"
});

// Dummy role (change to "user" to test read-only)
API.interceptors.request.use((req) => {
  req.headers.role = "admin";
  return req;
});

export default API;
