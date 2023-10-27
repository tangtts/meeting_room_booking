import axios from "axios";

axios.defaults.baseURL = "http://localhost:4396/";

axios.defaults.headers.Authorization =
  "Bearer " + localStorage.getItem("accessToken");

axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.log(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.log(error);
  }
);

export default axios;
