import axios from "axios";

const request = axios.create({
  baseURL: "https://6527dc38931d71583df1813a.mockapi.io/",
  timeout: 10000,
});

export default request;